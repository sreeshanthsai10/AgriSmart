import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
    ClipboardList, CheckCircle, XCircle, Clock, RefreshCw,
    User, MapPin, Calendar, Phone, IndianRupee, Tractor, Loader,
    Filter, ChevronDown, AlertCircle
} from 'lucide-react';

const API = 'http://localhost:5000/api/v1';

const ServiceRequests = () => {
    const { t } = useTranslation();
    const { user, isDealer, token } = useAuth();

    if (!user || !isDealer) return <Navigate to="/dashboard" replace />;

    const statusConfig = {
        pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
        accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
        rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },
        completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    };

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRequests = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/service-requests/dealer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.data || []);
            } else {
                showToast(data.message || 'Failed to load requests', 'error');
                setRequests([]);
            }
        } catch {
            showToast('Network error', 'error');
            setRequests([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchRequests();
    }, [token]);

    const updateStatus = async (id, status) => {
        if (!token) return;
        setUpdating(id + status);
        try {
            const res = await fetch(`${API}/service-requests/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Request ${status} successfully!`);
                fetchRequests();
            } else {
                showToast(data.message || 'Failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        }
        setUpdating(null);
    };

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    // Stats
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        accepted: requests.filter(r => r.status === 'accepted').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-agri-green animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading service requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white font-medium animate-fade-in ${toast.type === 'success' ? 'bg-agri-green' : 'bg-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Service Requests</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage equipment rental requests from farmers</p>
                        </div>
                    </div>

                    <button
                        onClick={fetchRequests}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Requests', value: stats.total, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700' },
                        { label: 'Accepted', value: stats.accepted, color: 'bg-green-50 text-green-700' },
                        { label: 'Completed', value: stats.completed, color: 'bg-purple-50 text-purple-700' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-2xl p-4`}>
                            <p className="text-2xl font-extrabold">{stat.value}</p>
                            <p className="text-sm font-medium opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { key: 'all', label: 'All Requests' },
                        { key: 'pending', label: '⏳ Pending' },
                        { key: 'accepted', label: '✅ Accepted' },
                        { key: 'completed', label: '✓ Completed' },
                        { key: 'rejected', label: '❌ Rejected' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                filter === f.key
                                    ? 'bg-agri-green text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Requests Found</h3>
                        <p className="text-gray-500">{filter !== 'all' ? 'Try changing the filter' : 'No service requests yet'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(req => {
                            const sc = statusConfig[req.status] || statusConfig.pending;
                            const StatusIcon = sc.icon;
                            const safeDate = req.requestedDate ? new Date(req.requestedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

                            return (
                                <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        
                                        {/* Equipment Info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <Tractor className="w-7 h-7 text-amber-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                                    {req.equipment?.name || 'Unknown Equipment'}
                                                </h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-4 h-4" />
                                                        {req.farmer?.name || 'Unknown Farmer'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {safeDate}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {req.durationDays || 0} day{req.durationDays !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Farmer Contact Info */}
                                        <div className="flex flex-col gap-1 text-sm text-gray-500 flex-shrink-0">
                                            {req.farmer?.phone && (
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="w-4 h-4" /> {req.farmer.phone}
                                                </span>
                                            )}
                                            {req.farmAddress && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" /> {req.farmAddress}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" /> {sc.label}
                                            </span>

                                            {/* Action Buttons */}
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateStatus(req._id, 'accepted')}
                                                        disabled={updating === req._id + 'accepted'}
                                                        className="px-4 py-2 bg-agri-green text-white rounded-xl text-sm font-semibold hover:bg-agri-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                                    >
                                                        {updating === req._id + 'accepted' ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(req._id, 'rejected')}
                                                        disabled={updating === req._id + 'rejected'}
                                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                </div>
                                            )}

                                            {req.status === 'accepted' && (
                                                <button
                                                    onClick={() => updateStatus(req._id, 'completed')}
                                                    disabled={updating === req._id + 'completed'}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                                >
                                                    {updating === req._id + 'completed' ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    Mark Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Farmer Message */}
                                    {req.message && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 italic">"{req.message}"</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceRequests;