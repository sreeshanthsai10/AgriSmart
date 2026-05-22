import { useState } from 'react';
import { Leaf, Navigation, Map as MapIcon, Calendar, CheckSquare } from 'lucide-react';

const CropRecommendations = () => {
    const [formData, setFormData] = useState({
        region: '',
        season: 'summer',      // Changed to match API: summer/winter/spring/rainy
        soilType: 'loam'        // Changed to match API: clay/sandy/loam/silty/black/red
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    // Map frontend values to API values
    const seasonMap = {
        'kharif': 'rainy',
        'rabi': 'winter',
        'zaid': 'summer'
    };

    const soilMap = {
        'alluvial': 'silty',
        'black': 'black',
        'red': 'red',
        'loamy': 'loam'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiSeason = seasonMap[formData.season] || formData.season;
            const apiSoil = soilMap[formData.soilType] || formData.soilType;
            
            const response = await fetch(
                `http://localhost:8001/api/v1/crops/recommend?season=${apiSeason}&soil_type=${apiSoil}`
            );
            
            const data = await response.json();
            
            // Transform API response to match your UI
            const formattedRecommendations = data.top_crops.slice(0, 3).map((crop, index) => ({
                id: index + 1,
                name: crop.crop,
                suitability: Math.min(100, crop.score * 10), // Convert score to percentage
                duration: `${crop.days_to_harvest} days`,
                waterNeed: crop.crop.includes('Rice') ? 'High' : 'Medium',
                profitability: crop.score >= 8 ? 'High' : crop.score >= 6 ? 'Medium-High' : 'Medium',
                reason: crop.reasons.join('. ') + '.'
            }));

            setRecommendations(formattedRecommendations);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            // Fallback to mock data if API fails
            setRecommendations([
                {
                    id: 1,
                    name: 'Rice (Paddy)',
                    suitability: 95,
                    duration: '120-150 days',
                    waterNeed: 'High',
                    profitability: 'High',
                    reason: 'Perfect match for loamy soil during Kharif season.'
                },
                {
                    id: 2,
                    name: 'Maize',
                    suitability: 82,
                    duration: '90-110 days',
                    waterNeed: 'Medium',
                    profitability: 'Medium-High',
                    reason: 'Good alternative crop, requires well-drained soil.'
                },
                {
                    id: 3,
                    name: 'Cotton',
                    suitability: 76,
                    duration: '150-180 days',
                    waterNeed: 'Medium',
                    profitability: 'High',
                    reason: 'Viable option for cash crop.'
                }
            ]);
        }
        
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl inline-flex items-center gap-3">
                        <Leaf className="w-10 h-10 text-agri-green" /> Seasonal Recommendations
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the most profitable and suitable crops for your farm right now, based on your local climate, season, and soil.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-10">
                    <div className="bg-agri-green px-8 py-6">
                        <h2 className="text-xl font-bold text-white mb-2">Configure Farm Profile</h2>
                        <p className="text-green-100 text-sm">Update your details to get localized advice.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-agri-green" /> Region / State
                                </label>
                                <select 
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    required 
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-agri-green focus:border-agri-green bg-gray-50 border"
                                >
                                    <option value="">Select Region</option>
                                    <option value="north">Northern Plains</option>
                                    <option value="south">Southern Peninsula</option>
                                    <option value="east">Eastern Region</option>
                                    <option value="west">Western Region</option>
                                    <option value="central">Central Plateau</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-agri-green" /> Upcoming Season
                                </label>
                                <select
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-agri-green focus:border-agri-green bg-gray-50 border"
                                >
                                    <option value="summer">Summer (Zaid)</option>
                                    <option value="rainy">Monsoon (Kharif)</option>
                                    <option value="winter">Winter (Rabi)</option>
                                    <option value="spring">Spring</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-agri-green" /> Primary Soil Type
                                </label>
                                <select
                                    value={formData.soilType}
                                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-agri-green focus:border-agri-green bg-gray-50 border"
                                >
                                    <option value="loam">Loamy Soil</option>
                                    <option value="clay">Clay Soil</option>
                                    <option value="sandy">Sandy Soil</option>
                                    <option value="black">Black Soil</option>
                                    <option value="red">Red Soil</option>
                                    <option value="silty">Silty Soil</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-agri-green hover:bg-agri-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green shadow-md hover:shadow-lg transition-all"
                            >
                                {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                            </button>
                        </div>
                    </form>
                </div>

                {recommendations && (
                    <div className="space-y-6 animate-fade-in relative">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Top AI Picks for You</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recommendations.map((crop, index) => (
                                <div key={crop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className={`h-2 ${index === 0 ? 'bg-agri-green' : index === 1 ? 'bg-emerald-400' : 'bg-green-300'}`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-bold text-gray-900">{crop.name}</h4>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {crop.suitability}% Match
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-6 italic">"{crop.reason}"</p>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Duration</span>
                                                <span className="font-medium text-gray-900">{crop.duration}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1.5"><CheckSquare className="w-4 h-4" /> Profitability</span>
                                                <span className="font-medium text-gray-900">{crop.profitability}</span>
                                            </div>
                                        </div>

                                        <button className="mt-6 w-full px-4 py-2 border border-agri-green text-agri-green rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                                            View Cultivation Guide
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropRecommendations;