import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tractor, Search, MapPin, IndianRupee, Calendar, Clock, X, Loader, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const API = 'http://localhost:5000/api/v1';
const BASE_URL = 'http://localhost:5000';

const emptyReq = {
    farmAddress: '',
    requestedDate: '',
    durationDays: 1,
    message: ''
};

const GetService = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedEquip, setSelectedEquip] = useState(null);
    const [reqForm, setReqForm] = useState(emptyReq);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchEquipment = async (lat = null, lng = null) => {
            try {
                let url = `${API}/equipment`;

                if (lat && lng) {
                    url = `${API}/equipment/nearby?lat=${lat}&lng=${lng}`;
                }

                const res = await fetch(url);
                const data = await res.json();

                if (data.success) {
                    setEquipment(data.data);
                } else {
                    setEquipment([]);
                    showToast('Failed to load equipment', 'error');
                }

            } catch {
                showToast('Network error', 'error');
                setEquipment([]);
            }

            setLoading(false);
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchEquipment(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                fetchEquipment();
            }
        );

    }, []);

    const filtered = equipment.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.address || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleRequest = async (e) => {
        e.preventDefault();

        if (!token) return showToast('Login required', 'error');

        if (!reqForm.farmAddress || !reqForm.requestedDate) {
            return showToast('Please fill required fields', 'error');
        }

        if (reqForm.durationDays < 1) {
            return showToast('Duration must be at least 1 day', 'error');
        }

        const today = new Date().toISOString().split('T')[0];
        if (reqForm.requestedDate < today) {
            return showToast('Select a valid future date', 'error');
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API}/service-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    equipmentId: selectedEquip._id,
                    farmAddress: reqForm.farmAddress,
                    requestedDate: reqForm.requestedDate,
                    durationDays: Number(reqForm.durationDays),
                    message: reqForm.message
                })
            });

            const data = await res.json();

            if (data.success) {
                showToast('Request sent successfully');
                setSelectedEquip(null);
                setReqForm(emptyReq);
            } else {
                showToast(data.message || 'Failed to send request', 'error');
            }

        } catch {
            showToast('Network error', 'error');
        }

        setSubmitting(false);
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Toast Notification */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white font-medium animate-fade-in ${
                        toast.type === 'success' ? 'bg-agri-green' : 'bg-red-500'
                    }`}>
                        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Tractor className="w-8 h-8 text-agri-green" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Equipment Services
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Rent farming equipment near you. Select your machinery and book it for your field.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-10">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search equipment or location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all text-gray-700"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 text-agri-green animate-spin mb-4" />
                        <p className="text-gray-500">Finding equipment near you...</p>
                    </div>
                ) : (
                    <>
                        {/* Equipment Grid */}
                        {filtered.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map(item => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={`${BASE_URL}${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <Tractor className="w-16 h-16 text-gray-300" />
                                                </div>
                                            )}
                                            {!item.isAvailable && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">Currently Unavailable</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                                            
                                            <div className="space-y-2 mb-4">
                                                <p className="text-sm text-gray-500 capitalize flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-agri-green rounded-full"></span>
                                                    {item.category}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <IndianRupee className="w-4 h-4 text-agri-green" />
                                                    <span className="font-semibold text-gray-900">₹{item.pricePerDay}</span>
                                                    <span className="text-gray-400">/ day</span>
                                                </p>
                                                {item.address && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-agri-green" />
                                                        {item.address}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                disabled={!item.isAvailable}
                                                onClick={() => item.isAvailable && setSelectedEquip(item)}
                                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                                                    item.isAvailable
                                                        ? 'bg-agri-green text-white hover:bg-agri-dark shadow-md hover:shadow-lg'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {item.isAvailable ? 'Request Booking' : 'Unavailable'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No Equipment Found</h3>
                                <p className="text-gray-500">Try adjusting your search or check back later.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Booking Modal */}
                {selectedEquip && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            
                            {/* Modal Header */}
                            <div className="bg-agri-green px-8 py-6 rounded-t-3xl flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Book Equipment</h2>
                                <button
                                    onClick={() => setSelectedEquip(null)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Selected Equipment Info */}
                            <div className="px-8 py-4 bg-green-50 border-b border-green-100">
                                <p className="font-bold text-gray-900 text-lg">{selectedEquip.name}</p>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <IndianRupee className="w-4 h-4" /> ₹{selectedEquip.pricePerDay}/day
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleRequest} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-agri-green" /> Farm Address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your farm address"
                                        value={reqForm.farmAddress}
                                        onChange={e => setReqForm({ ...reqForm, farmAddress: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-agri-green" /> Requested Date
                                    </label>
                                    <input
                                        type="date"
                                        value={reqForm.requestedDate}
                                        onChange={e => setReqForm({ ...reqForm, requestedDate: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-agri-green" /> Duration (Days)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={reqForm.durationDays}
                                        onChange={e => setReqForm({ ...reqForm, durationDays: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-agri-green" /> Message (Optional)
                                    </label>
                                    <textarea
                                        placeholder="Any special requirements..."
                                        value={reqForm.message}
                                        onChange={e => setReqForm({ ...reqForm, message: e.target.value })}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedEquip(null)}
                                        className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 bg-agri-green text-white rounded-xl font-semibold hover:bg-agri-dark transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <><Loader className="animate-spin w-4 h-4" /> Sending...</>
                                        ) : (
                                            'Confirm Booking'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetService;