import { LineChart, LayoutDashboard, Leaf, TrendingUp, ThermometerSun, CloudRain, Store, BookOpen, MapPin, Search, Bell, Sprout, Tractor, Loader, AlertTriangle, CheckCircle, Info, AlertOctagon, Wind, Droplets, Navigation, MapPinOff, RefreshCw } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Dashboard = () => {
    const { user, isFarmer, isCustomer } = useAuth();
    const { t } = useTranslation();

    const [weather, setWeather] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [yieldData, setYieldData] = useState(null);
    const [soil, setSoil] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locationStatus, setLocationStatus] = useState('prompt');
    const [userLocation, setUserLocation] = useState(null);
    const [cityName, setCityName] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    if (!user) return <Navigate to="/login" replace />;

    // 📍 Get precise location
    const getPreciseLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            const options = {
                enableHighAccuracy: true, // Use GPS if available
                timeout: 15000,           // Wait up to 15 seconds
                maximumAge: 0             // Don't use cached position
            };

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        accuracy: pos.coords.accuracy // Accuracy in meters
                    });
                },
                (err) => reject(err),
                options
            );
        });
    };

    // 🗺 Reverse Geocode - Get city name from coordinates
    const getCityName = async (lat, lon) => {
        try {
            const res = await axios.get(
                'https://api.openweathermap.org/geo/1.0/reverse',
                {
                    params: {
                        lat,
                        lon,
                        limit: 1,
                        appid: API_KEY
                    }
                }
            );
            if (res.data && res.data.length > 0) {
                const location = res.data[0];
                return `${location.name}, ${location.state || ''}, ${location.country}`;
            }
            return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        } catch (err) {
            console.error('Geocode error:', err);
            return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        }
    };

    //  Request location with better accuracy
    const requestLocation = async () => {
        setRefreshing(true);
        setLocationStatus('prompt');

        try {
            const coords = await getPreciseLocation();
            setUserLocation(coords);
            setLocationStatus('granted');
            
            // Get city name
            const city = await getCityName(coords.lat, coords.lon);
            setCityName(city);
            
            // Load dashboard with precise coordinates
            await loadDashboard(coords);
        } catch (err) {
            console.log('Location error:', err.message);
            setLocationStatus('denied');
            // Try with IP-based location as fallback
            await loadDashboard(null);
        }
        
        setRefreshing(false);
    };

    //  IP-based location fallback
    const getIPLocation = async () => {
        try {
            const res = await axios.get('https://ipapi.co/json/');
            return {
                lat: res.data.latitude,
                lon: res.data.longitude
            };
        } catch (err) {
            // Default to Bhopal, India
            return { lat: 23.2599, lon: 77.4126 };
        }
    };

    // 🌦 Fetch Weather
    const fetchWeather = async (coords) => {
        let params;
        
        if (coords) {
            params = { lat: coords.lat, lon: coords.lon };
        } else {
            params = await getIPLocation();
        }

        try {
            const res = await axios.get(
                'https://api.openweathermap.org/data/2.5/weather',
                {
                    params: {
                        lat: params.lat,
                        lon: params.lon,
                        appid: API_KEY,
                        units: 'metric'
                    }
                }
            );
            
            // Get city name if not already set
            if (!cityName) {
                const city = await getCityName(params.lat, params.lon);
                setCityName(city);
            }
            
            return res.data;
        } catch (err) {
            console.error("Weather API error:", err);
            return {
                weather: [{ main: "Clouds", description: "scattered clouds", icon: "02d" }],
                main: { temp: 28, temp_min: 24, temp_max: 32, humidity: 65, feels_like: 30 },
                wind: { speed: 3.5 },
                name: cityName || "Your Location"
            };
        }
    };

    //  Fetch Prediction
    const fetchPrediction = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/predict/latest');
            return res.data;
        } catch (err) {
            return null;
        }
    };

    //  Fetch Bookings
    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/equipment/my-bookings');
            setBookings(res.data);
        } catch (err) {
            console.error("Booking error:", err);
        }
    };

    //  Generate Alerts
    const generateAlerts = (weatherData, prediction) => {
        let alerts = [];
        const condition = weatherData?.weather?.[0]?.main;
        const temp = weatherData?.main?.temp;
        const humidity = weatherData?.main?.humidity;

        if (condition === "Rain" || condition === "Drizzle") {
            alerts.push({ title: "🌧 Rain expected - Delay irrigation and protect harvested crops", type: "info" });
        }
        if (condition === "Thunderstorm") {
            alerts.push({ title: "⛈ Thunderstorm warning - Secure equipment and seek shelter", type: "danger" });
        }
        if (temp > 35) {
            alerts.push({ title: "🌡 Extreme heat alert - Increase irrigation frequency", type: "warning" });
        }
        if (temp < 5) {
            alerts.push({ title: "🥶 Frost warning - Protect sensitive crops with covers", type: "danger" });
        }
        if (humidity > 85) {
            alerts.push({ title: "💧 High humidity - Monitor for fungal diseases", type: "warning" });
        }
        if (prediction?.confidence > 0.8) {
            alerts.push({ title: `🦠 Disease detected: ${prediction.disease} - Apply treatment`, type: "danger" });
        }
        if (alerts.length === 0) {
            alerts.push({ title: "✅ All conditions optimal - No active alerts", type: "success" });
        }

        return alerts;
    };

    //  Load Dashboard
    const loadDashboard = async (coords) => {
        setLoading(true);
        
        const [weatherData, prediction] = await Promise.all([
            fetchWeather(coords),
            fetchPrediction()
        ]);

        setWeather(weatherData);
        fetchBookings();

        const humidity = weatherData?.main?.humidity || 60;
        const temp = weatherData?.main?.temp || 25;
        
        setYieldData(temp > 30 ? "-5.2%" : temp < 20 ? "+2.1%" : "+14.8%");
        setSoil(`${Math.min(95, Math.round(humidity * 0.8))}%`);
        setAlerts(generateAlerts(weatherData, prediction));
        
        setLoading(false);
    };

    useEffect(() => {
        requestLocation();
    }, []);

    const getWeatherIcon = (condition) => {
        const icons = {
            Clear: '☀️', Clouds: '☁️', Rain: '🌧', Drizzle: '🌦',
            Thunderstorm: '⛈', Snow: '🌨', Mist: '🌫', Haze: '🌫', Fog: '🌫'
        };
        return icons[condition] || '🌤';
    };

    const alertIcons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        danger: <AlertOctagon className="w-5 h-5 text-red-500" />
    };

    const alertStyles = {
        success: 'bg-green-50 border-green-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-amber-50 border-amber-200',
        danger: 'bg-red-50 border-red-200'
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-agri-green animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading your farm dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-xl">
                            <LayoutDashboard className="w-6 h-6 text-agri-green" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            {t('dashboard.welcomeBack', { name: user.name })}
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-14">
                        {isFarmer ? t('dashboard.farmerSubtitle') : t('dashboard.customerSubtitle')}
                    </p>
                </div>

                {/* Location Status */}
                {locationStatus === 'denied' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MapPinOff className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-amber-800">Location access denied</p>
                                <p className="text-sm text-amber-600">Using approximate location based on your network</p>
                            </div>
                        </div>
                        <button
                            onClick={requestLocation}
                            disabled={refreshing}
                            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors flex items-center gap-2"
                        >
                            {refreshing ? <Loader className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                            {refreshing ? 'Detecting...' : 'Enable GPS'}
                        </button>
                    </div>
                )}

                {locationStatus === 'granted' && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Navigation className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-green-800">
                                    📍 {cityName || weather?.name || "Your Location"}
                                </p>
                                {userLocation?.accuracy && (
                                    <p className="text-xs text-green-600">GPS Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={requestLocation}
                            disabled={refreshing}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                )}

                {isFarmer && (
                    <>
                        {/* Weather Card */}
                        {weather && (
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-lg p-8 text-white mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {cityName || weather.name}
                                    </p>
                                    <button
                                        onClick={requestLocation}
                                        disabled={refreshing}
                                        className="text-xs text-blue-200 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                                        {refreshing ? 'Updating...' : 'Update Weather'}
                                    </button>
                                </div>
                                
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <span className="text-7xl">{getWeatherIcon(weather.weather[0].main)}</span>
                                        <div>
                                            <h2 className="text-6xl font-extrabold">
                                                {Math.round(weather.main.temp)}°<span className="text-2xl text-blue-200">C</span>
                                            </h2>
                                            <p className="text-lg text-blue-100 mt-1 capitalize">{weather.weather[0].description}</p>
                                            <p className="text-sm text-blue-200 mt-1">Feels like {Math.round(weather.main.feels_like)}°C</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="text-center">
                                            <ThermometerSun className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{Math.round(weather.main.temp_max)}°</p>
                                            <p className="text-xs text-blue-200">High</p>
                                        </div>
                                        <div className="text-center">
                                            <ThermometerSun className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{Math.round(weather.main.temp_min)}°</p>
                                            <p className="text-xs text-blue-200">Low</p>
                                        </div>
                                        <div className="text-center">
                                            <Droplets className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{weather.main.humidity}%</p>
                                            <p className="text-xs text-blue-200">Humidity</p>
                                        </div>
                                        <div className="text-center">
                                            <Wind className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{weather.wind.speed}</p>
                                            <p className="text-xs text-blue-200">m/s Wind</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="p-3 bg-green-50 rounded-xl w-fit mb-4">
                                    <TrendingUp className="w-6 h-6 text-agri-green" />
                                </div>
                                <p className="text-sm text-gray-500">{t('dashboard.totalYield')}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{yieldData}</h3>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="p-3 bg-amber-50 rounded-xl w-fit mb-4">
                                    <Sprout className="w-6 h-6 text-amber-600" />
                                </div>
                                <p className="text-sm text-gray-500">{t('dashboard.soilMoisture')}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{soil}</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-agri-green h-2 rounded-full" style={{ width: soil }}></div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="p-3 bg-red-50 rounded-xl w-fit mb-4">
                                    <Bell className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-sm text-gray-500">Active Alerts</p>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    {alerts.filter(a => a.type !== 'success').length}
                                </h3>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-agri-green" /> Smart Alerts
                            </h2>
                            <div className="space-y-3">
                                {alerts.map((a, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${alertStyles[a.type]}`}>
                                        {alertIcons[a.type]}
                                        <p className="text-sm font-medium text-gray-800">{a.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;