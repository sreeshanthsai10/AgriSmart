import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Clock, Plus, Trash2, Save, Loader, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

const ManageStore = () => {
    const { user, isFarmer } = useAuth();

    if (!user || (!isFarmer && user.role !== 'farmer')) {
        return <Navigate to="/dashboard" replace />;
    }

    const [storeDetails, setStoreDetails] = useState({
        storeName: user?.name ? `${user.name}'s Farm Store` : 'Farm Store',
        address: '',
        phone: '',
        hours: 'Mon-Sat: 8 AM - 6 PM',
        status: 'open',
        lat: null,
        lng: null
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [locating, setLocating] = useState(false);
    const [toast, setToast] = useState(null);
    const [inventory, setInventory] = useState([
        { id: 1, item: 'Organic Tomatoes', price: '45', unit: 'kg', stock: 'In Stock' },
        { id: 2, item: 'Fresh Potatoes', price: '20', unit: 'kg', stock: 'Low Stock' },
    ]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await api.get('/v1/stores/my-store');
                if (res.data?.success && res.data?.store) {
                    const s = res.data.store;
                    setStoreDetails({
                        storeName: s.name || storeDetails.storeName,
                        address: s.address?.street || '',
                        phone: s.phone || '',
                        hours: s.openingHours || 'Mon-Sat: 8 AM - 6 PM',
                        status: s.isActive ? 'open' : 'closed',
                        lat: s.location?.coordinates?.[1] || null,
                        lng: s.location?.coordinates?.[0] || null
                    });
                }
            } catch (error) {
                console.error('Failed to fetch store:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            showToast('Geolocation not supported on this device', 'error');
            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                    );
                    const data = await res.json();
                    const fullAddress = data.display_name || '';

                    setStoreDetails(prev => ({
                        ...prev,
                        lat,
                        lng,
                        address: fullAddress
                    }));

                    showToast('Location and address captured successfully');
                } catch (err) {
                    setStoreDetails(prev => ({ ...prev, lat, lng }));
                    showToast('Location captured (address lookup failed)', 'error');
                }

                setLocating(false);
            },
            () => {
                showToast('Location access denied', 'error');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleUpdateStore = async (e) => {
        e.preventDefault();

        if (!storeDetails.lat || !storeDetails.lng) {
            showToast('Please set your location first', 'error');
            return;
        }

        setSaving(true);

        try {
            const payload = {
                name: storeDetails.storeName,
                address: { street: storeDetails.address },
                phone: storeDetails.phone,
                openingHours: storeDetails.hours,
                isActive: storeDetails.status === 'open',
                location: {
                    type: 'Point',
                    coordinates: [storeDetails.lng, storeDetails.lat]
                }
            };

            const res = await api.post('/v1/stores', payload);

            if (res.data?.success) {
                showToast('Store saved successfully');
            } else {
                showToast('Failed to save store', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save store', 'error');
        }

        setSaving(false);
    };

    const addInventoryItem = () => {
        const newItem = {
            id: Date.now(),
            item: 'New Product',
            price: '0',
            unit: 'kg',
            stock: 'In Stock'
        };
        setInventory([...inventory, newItem]);
    };

    const removeInventoryItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const updateInventoryItem = (id, field, value) => {
        setInventory(inventory.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader className="w-8 h-8 text-agri-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
                        toast.type === 'success' ? 'bg-agri-green' : 'bg-red-500'
                    }`}>
                        {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-green-100 rounded-xl">
                        <Store className="w-6 h-6 text-agri-green" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Manage Your Store</h1>
                        <p className="text-gray-500 text-sm mt-1">Update your store presence and inventory</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Store Details Form */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleUpdateStore} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Store Profile</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                                    <input
                                        type="text"
                                        value={storeDetails.storeName}
                                        onChange={e => setStoreDetails({ ...storeDetails, storeName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" /> Address
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={storeDetails.address}
                                        onChange={e => setStoreDetails({ ...storeDetails, address: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 text-sm resize-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={locating}
                                        className="mt-2 inline-flex items-center gap-1.5 text-agri-green text-sm font-medium hover:text-agri-dark disabled:opacity-50"
                                    >
                                        {locating ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Navigation className="w-4 h-4" />
                                        )}
                                        {locating ? 'Detecting location...' : 'Use My Location'}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={storeDetails.phone}
                                        onChange={e => setStoreDetails({ ...storeDetails, phone: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" /> Operating Hours
                                    </label>
                                    <input
                                        type="text"
                                        value={storeDetails.hours}
                                        onChange={e => setStoreDetails({ ...storeDetails, hours: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                    <select
                                        value={storeDetails.status}
                                        onChange={e => setStoreDetails({ ...storeDetails, status: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 text-sm"
                                    >
                                        <option value="open">Open Now</option>
                                        <option value="closed">Closed Temporarily</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm bg-agri-green hover:bg-agri-dark transition-colors shadow-md disabled:opacity-50"
                            >
                                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Inventory Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Current Inventory</h2>
                                <button
                                    onClick={addInventoryItem}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-green text-white rounded-xl text-sm font-semibold hover:bg-agri-dark transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            {inventory.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No inventory items yet</p>
                                    <button onClick={addInventoryItem} className="mt-3 text-agri-green text-sm font-semibold hover:underline">
                                        Add your first product
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {inventory.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={item.item}
                                                            onChange={e => updateInventoryItem(item.id, 'item', e.target.value)}
                                                            className="w-full bg-transparent font-medium text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-agri-green rounded px-2 py-1"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={item.price}
                                                            onChange={e => updateInventoryItem(item.id, 'price', e.target.value)}
                                                            className="w-20 bg-transparent text-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-agri-green rounded px-2 py-1"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={item.unit}
                                                            onChange={e => updateInventoryItem(item.id, 'unit', e.target.value)}
                                                            className="w-16 bg-transparent text-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-agri-green rounded px-2 py-1"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={item.stock}
                                                            onChange={e => updateInventoryItem(item.id, 'stock', e.target.value)}
                                                            className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${
                                                                item.stock === 'In Stock' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-amber-100 text-amber-700'
                                                            }`}
                                                        >
                                                            <option value="In Stock">In Stock</option>
                                                            <option value="Low Stock">Low Stock</option>
                                                            <option value="Out of Stock">Out of Stock</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => removeInventoryItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Info Banner */}
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-green-100 rounded-lg">
                                    <Store className="w-5 h-5 text-agri-green" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-900 text-sm">Your store is visible to customers</p>
                                    <p className="text-green-700 text-xs mt-1">Keep your inventory updated to attract more local buyers. Your store appears on the Customer Store Locator map.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManageStore;