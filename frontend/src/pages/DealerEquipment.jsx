import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
    Tractor, Plus, Trash2, Edit3, X, CheckCircle, AlertCircle,
    DollarSign, MapPin, Tag, PackageCheck, Image, Phone, Loader,
    IndianRupee, ToggleLeft, ToggleRight, Search
} from 'lucide-react';

const CATEGORIES = ['Tractor', 'Drone', 'Harvester', 'Sprayer', 'Plough', 'Seeder', 'Irrigation', 'Other'];

const categoryColors = {
    Tractor: 'bg-amber-100 text-amber-700',
    Drone: 'bg-blue-100 text-blue-700',
    Harvester: 'bg-orange-100 text-orange-700',
    Sprayer: 'bg-purple-100 text-purple-700',
    Plough: 'bg-red-100 text-red-700',
    Seeder: 'bg-green-100 text-green-700',
    Irrigation: 'bg-cyan-100 text-cyan-700',
    Other: 'bg-gray-100 text-gray-700',
};

const API = 'http://localhost:5000/api/v1';
const BASE_URL = 'http://localhost:5000';

const emptyForm = {
    name: '',
    category: 'Tractor',
    description: '',
    pricePerDay: '',
    location: '',
    contactPhone: ''
};

const DealerEquipment = () => {
    const { t } = useTranslation();
    const { user, isDealer, token } = useAuth();

    if (!user || !isDealer) return <Navigate to="/dashboard" replace />;

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [search, setSearch] = useState('');

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchEquipment = async () => {
        try {
            const res = await fetch(`${API}/equipment/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setEquipment(data.data);
        } catch {}
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchEquipment();
    }, [token]);

    const openAdd = () => {
        setForm(emptyForm);
        setEditId(null);
        setImageFile(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setForm({
            name: item.name,
            category: item.category,
            description: item.description || '',
            pricePerDay: item.pricePerDay,
            location: item.address,
            contactPhone: item.contactPhone || '',
            preview: item.image ? `${BASE_URL}${item.image}` : null
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editId ? `${API}/equipment/${editId}` : `${API}/equipment`;
            const method = editId ? 'PUT' : 'POST';
            const formData = new FormData();

            formData.append('name', form.name);
            formData.append('category', form.category);
            formData.append('description', form.description);
            formData.append('pricePerDay', form.pricePerDay);
            formData.append('address', form.location);
            formData.append('contactPhone', form.contactPhone);
            if (imageFile) formData.append('image', imageFile);

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                showToast(editId ? 'Equipment updated successfully!' : 'Equipment added successfully!');
                setShowModal(false);
                fetchEquipment();
            } else {
                showToast(data.message || 'Error saving equipment', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this equipment?')) return;
        try {
            const res = await fetch(`${API}/equipment/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                showToast('Equipment removed successfully');
                fetchEquipment();
            } else showToast(data.message, 'error');
        } catch {
            showToast('Network error', 'error');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            await fetch(`${API}/equipment/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable: !item.isAvailable })
            });
            fetchEquipment();
            showToast(`Equipment ${item.isAvailable ? 'unavailable' : 'available'} now`);
        } catch {}
    };

    const filteredEquipment = equipment.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.address || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-agri-green animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading your equipment...</p>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-xl">
                            <Tractor className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">My Equipment</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage your equipment listings</p>
                        </div>
                    </div>

                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-agri-green text-white rounded-xl font-semibold hover:bg-agri-dark transition-colors shadow-md"
                    >
                        <Plus className="w-5 h-5" /> Add Equipment
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Listed', value: equipment.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Available', value: equipment.filter(e => e.isAvailable).length, color: 'bg-green-50 text-green-700' },
                        { label: 'Rented Out', value: equipment.filter(e => !e.isAvailable).length, color: 'bg-amber-50 text-amber-700' },
                        { label: 'Categories', value: [...new Set(equipment.map(e => e.category))].length, color: 'bg-purple-50 text-purple-700' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-2xl p-4`}>
                            <p className="text-2xl font-extrabold">{stat.value}</p>
                            <p className="text-sm font-medium opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your equipment..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none"
                    />
                </div>

                {/* Equipment Grid */}
                {filteredEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEquipment.map(item => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {item.image ? (
                                        <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Tractor className="w-16 h-16 text-gray-300" />
                                        </div>
                                    )}
                                    
                                    {/* Availability Toggle */}
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors"
                                    >
                                        {item.isAvailable ? (
                                            <><ToggleRight className="w-4 h-4 text-green-600" /> <span className="text-green-700">Available</span></>
                                        ) : (
                                            <><ToggleLeft className="w-4 h-4 text-red-500" /> <span className="text-red-600">Rented</span></>
                                        )}
                                    </button>

                                    {/* Category Badge */}
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[item.category] || 'bg-gray-100 text-gray-700'}`}>
                                        {item.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.name}</h3>
                                    
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4 text-agri-green" />
                                            <span className="font-semibold text-gray-900">₹{item.pricePerDay}</span> / day
                                        </p>
                                        {item.address && (
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-agri-green" />
                                                {item.address}
                                            </p>
                                        )}
                                        {item.contactPhone && (
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-agri-green" />
                                                {item.contactPhone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Equipment Found</h3>
                        <p className="text-gray-500 mb-6">
                            {search ? 'Try adjusting your search' : 'Start by adding your first equipment listing'}
                        </p>
                        {!search && (
                            <button onClick={openAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-agri-green text-white rounded-xl font-semibold hover:bg-agri-dark transition-colors">
                                <Plus className="w-5 h-5" /> Add Equipment
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                        
                        {/* Modal Header */}
                        <div className="bg-agri-green px-8 py-6 rounded-t-3xl flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Tractor className="w-5 h-5" />
                                {editId ? 'Edit Equipment' : 'Add New Equipment'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Equipment Name *</label>
                                <input
                                    required
                                    placeholder="e.g. John Deere Tractor"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    placeholder="Describe your equipment..."
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Per Day (₹) *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 2500"
                                    value={form.pricePerDay}
                                    onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                                <input
                                    required
                                    placeholder="e.g. Indore, MP"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                                <input
                                    placeholder="+91 98765 43210"
                                    value={form.contactPhone}
                                    onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Equipment Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        if (file) setForm(f => ({ ...f, preview: URL.createObjectURL(file) }));
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-agri-green hover:file:bg-green-100"
                                />
                                {form.preview && (
                                    <img src={form.preview} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-xl" />
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                        <><Loader className="animate-spin w-4 h-4" /> Saving...</>
                                    ) : (
                                        <><CheckCircle className="w-4 h-4" /> {editId ? 'Update' : 'Add Equipment'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealerEquipment;