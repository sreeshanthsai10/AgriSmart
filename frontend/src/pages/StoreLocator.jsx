import { useState, useEffect } from 'react';
import { MapPin, Search, Phone, Navigation, Store, Loader, ChevronRight, ShoppingBag, X, ExternalLink, Route, IndianRupee } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// User location marker icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

const FitBounds = ({ stores, userLocation }) => {
  const map = useMap();
  useEffect(() => {
    const points = [];
    if (userLocation) points.push(userLocation);
    stores.filter(s => s.lat && s.lng).forEach(s => points.push([s.lat, s.lng]));
    
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50], maxZoom: 14 });
    }
  }, [stores, userLocation, map]);
  return null;
};

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  const fetchStores = async () => {
    try {
      const res = await api.get('/v1/stores');
      const mapped = res.data.stores
        .filter(s => s.location && s.location.coordinates?.length === 2)
        .map(s => {
          const lat = s.location.coordinates[1];
          const lng = s.location.coordinates[0];
          let distance = '';
          if (userLocation) {
            distance = calculateDistance(userLocation[0], userLocation[1], lat, lng) + ' km';
          }
          return {
            id: s._id,
            name: s.name,
            address: s.address?.street || '',
            phone: s.phone,
            lat,
            lng,
            distance,
            isOpen: s.isActive
          };
        });
      setStores(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
    fetchStores();
  }, []);

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  // Fetch inventory when store is selected
  const handleSelectStore = async (store) => {
    setSelectedStore(store);
    setLoadingInventory(true);
    
    try {
      const res = await api.get(`/v1/stores/${store.id}/inventory`);
      if (res.data?.success) {
        setInventory(res.data.inventory || []);
      } else {
        // Demo inventory if API not available
        setInventory([
          { id: 1, item: 'Organic Tomatoes', price: 45, unit: 'kg', stock: 'In Stock' },
          { id: 2, item: 'Fresh Potatoes', price: 20, unit: 'kg', stock: 'In Stock' },
          { id: 3, item: 'Green Chillies', price: 60, unit: 'kg', stock: 'Low Stock' },
          { id: 4, item: 'Onions', price: 30, unit: 'kg', stock: 'In Stock' },
        ]);
      }
    } catch (err) {
      // Demo data fallback
      setInventory([
        { id: 1, item: 'Organic Tomatoes', price: 45, unit: 'kg', stock: 'In Stock' },
        { id: 2, item: 'Fresh Potatoes', price: 20, unit: 'kg', stock: 'In Stock' },
        { id: 3, item: 'Green Chillies', price: 60, unit: 'kg', stock: 'Low Stock' },
        { id: 4, item: 'Onions', price: 30, unit: 'kg', stock: 'In Stock' },
      ]);
    }
    
    setLoadingInventory(false);
  };

  // Get directions from current location to store
  const getDirections = (store) => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${store.lat},${store.lng}&travelmode=driving`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`,
        '_blank'
      );
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-agri-green animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Finding stores near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-xl">
            <MapPin className="w-6 h-6 text-agri-green" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Store Locator</h1>
            <p className="text-gray-500 text-sm mt-1">Find fresh farm produce near you</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Search & Location */}
              <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none"
                  />
                </div>
                <button
                  onClick={handleUseLocation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-50 text-agri-green rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors"
                >
                  <Navigation className="w-4 h-4" /> Use My Location
                </button>
                {userLocation && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Location active
                  </p>
                )}
              </div>

              {/* Results Count */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredStores.length}</span> store{filteredStores.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Store List */}
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {filteredStores.length === 0 ? (
                  <div className="p-8 text-center">
                    <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No stores found</p>
                  </div>
                ) : (
                  filteredStores.map(store => (
                    <div
                      key={store.id}
                      onClick={() => handleSelectStore(store)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedStore?.id === store.id ? 'bg-green-50 border-l-4 border-l-agri-green' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{store.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{store.address}</span>
                          </p>
                          {store.phone && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Phone className="w-3 h-3 flex-shrink-0" /> {store.phone}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                      </div>

                      {store.distance && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold text-agri-green bg-green-50 px-2 py-0.5 rounded-full">
                            📏 {store.distance} away
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(store);
                            }}
                            className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                          >
                            <Route className="w-3 h-3" /> Directions
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Map & Inventory */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[400px]">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds stores={stores} userLocation={userLocation} />
                
                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <b>Your Location</b>
                    </Popup>
                  </Marker>
                )}
                
                {/* Store Markers */}
                {stores.map(store => (
                  <Marker 
                    key={store.id} 
                    position={[store.lat, store.lng]}
                    eventHandlers={{
                      click: () => handleSelectStore(store)
                    }}
                  >
                    <Popup>
                      <div className="text-sm min-w-[180px]">
                        <b className="text-gray-900">{store.name}</b><br />
                        <span className="text-gray-600 text-xs">{store.address}</span><br />
                        {store.phone && <span className="text-gray-600 text-xs">{store.phone}<br /></span>}
                        {store.distance && <span className="text-agri-green font-semibold text-xs">{store.distance}<br /></span>}
                        <button
                          onClick={() => getDirections(store)}
                          className="mt-2 w-full py-1.5 bg-agri-green text-white rounded-lg text-xs font-semibold hover:bg-agri-dark transition-colors flex items-center justify-center gap-1"
                        >
                          <Route className="w-3 h-3" /> Get Directions
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Selected Store Details & Inventory */}
            {selectedStore && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                
                {/* Store Header */}
                <div className="bg-agri-green px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedStore.name}</h2>
                    <p className="text-green-100 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {selectedStore.address}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Store Info Bar */}
                <div className="px-6 py-3 bg-green-50 border-b border-green-100 flex flex-wrap items-center gap-4 text-sm">
                  {selectedStore.phone && (
                    <a href={`tel:${selectedStore.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-agri-green">
                      <Phone className="w-4 h-4" /> {selectedStore.phone}
                    </a>
                  )}
                  {selectedStore.distance && (
                    <span className="flex items-center gap-1.5 text-gray-600">
                      📏 {selectedStore.distance} away
                    </span>
                  )}
                  <button
                    onClick={() => getDirections(selectedStore)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium ml-auto"
                  >
                    <Route className="w-4 h-4" /> Get Directions
                  </button>
                </div>

                {/* Inventory */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-agri-green" />
                    Available Products
                  </h3>

                  {loadingInventory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-agri-green animate-spin" />
                    </div>
                  ) : inventory.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No products listed yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Table Header */}
                      <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Status</span>
                      </div>
                      
                      {/* Inventory Items */}
                      {inventory.map(item => (
                        <div
                          key={item.id}
                          className="grid grid-cols-3 gap-4 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors items-center"
                        >
                          <span className="font-medium text-gray-900 text-sm">{item.item}</span>
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> {item.price} / {item.unit}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                            item.stock === 'In Stock' 
                              ? 'bg-green-100 text-green-700' 
                              : item.stock === 'Low Stock'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {item.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StoreLocator;