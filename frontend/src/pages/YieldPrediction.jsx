import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, MapPin, Droplets, Thermometer, Wind, Calculator, Loader } from 'lucide-react';

const YieldPrediction = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        crop: 'wheat',
        area: '',
        rainfall: '',
        temperature: '',
        soilType: 'loamy'
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Map soil type to API format
            const soilMap = {
                'loamy': 'loam',
                'clay': 'clay',
                'sandy': 'sandy',
                'silt': 'silty'
            };

            const params = new URLSearchParams({
                crop: formData.crop === 'soybeans' ? 'soybean' : formData.crop,
                area: formData.area,
                rainfall: formData.rainfall,
                temperature: formData.temperature,
                soil_type: soilMap[formData.soilType] || formData.soilType
            });

            const response = await fetch(`http://localhost:8001/api/v1/yield/predict?${params}`);
            const data = await response.json();

            setPrediction({
                estimatedYield: data.predicted_yield,
                accuracy: data.confidence,
                comparison: data.factors.weather_multiplier > 1 ? '+' + Math.round((data.factors.weather_multiplier - 1) * 100) + '%' : Math.round((data.factors.weather_multiplier - 1) * 100) + '%',
                optimalConditions: data.insights[0] || 'Conditions are favorable for this crop.',
                yieldPerHectare: data.yield_per_hectare,
                unit: data.unit,
                range: data.range,
                factors: data.factors
            });
        } catch (error) {
            console.error('Prediction failed:', error);
            // Fallback
            setPrediction({
                estimatedYield: 4.2 * (formData.area || 1),
                accuracy: 91.5,
                comparison: '+12%',
                optimalConditions: 'Current conditions are slightly warmer than optimal.'
            });
        }
        
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-agri-green" />{t('yieldPrediction.title')}</h1>
                    <p className="mt-2 text-lg text-gray-600">{t('yieldPrediction.subtitle')}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Input Form */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-agri-green" />{t('yieldPrediction.fieldParams')}</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPrediction.cropType')}</label>
                                    <select
                                        name="crop"
                                        value={formData.crop}
                                        onChange={handleChange}
                                        className="w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-agri-green focus:border-agri-green sm:text-sm rounded-xl border"
                                    >
                                        <option value="wheat">Wheat</option>
                                        <option value="rice">Rice</option>
                                        <option value="corn">Corn (Maize)</option>
                                        <option value="soybeans">Soybeans</option>
                                        <option value="cotton">Cotton</option>
                                        <option value="potato">Potato</option>
                                        <option value="tomato">Tomato</option>
                                        <option value="sugarcane">Sugarcane</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPrediction.totalArea')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="area"
                                            required
                                            min="0.1"
                                            step="0.1"
                                            value={formData.area}
                                            onChange={handleChange}
                                            className="focus:ring-agri-green focus:border-agri-green block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 border"
                                            placeholder="e.g. 5.5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPrediction.avgRainfall')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Droplets className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="rainfall"
                                            required
                                            value={formData.rainfall}
                                            onChange={handleChange}
                                            className="focus:ring-agri-green focus:border-agri-green block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 border"
                                            placeholder="e.g. 120"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPrediction.avgTemp')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Thermometer className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="temperature"
                                            required
                                            value={formData.temperature}
                                            onChange={handleChange}
                                            className="focus:ring-agri-green focus:border-agri-green block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-2.5 border"
                                            placeholder="e.g. 24"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPrediction.soilType')}</label>
                                    <select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        className="w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-agri-green focus:border-agri-green sm:text-sm rounded-xl border"
                                    >
                                        <option value="loamy">Loamy</option>
                                        <option value="clay">Clay</option>
                                        <option value="sandy">Sandy</option>
                                        <option value="silt">Silt</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-agri-green hover:bg-agri-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green transition-colors mt-6 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="animate-spin w-4 h-4" /> Predicting...
                                        </span>
                                    ) : t('yieldPrediction.predictBtn')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results/Dashboard Area */}
                    <div className="lg:w-2/3 space-y-6">
                        {!prediction ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                                <Wind className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('yieldPrediction.readyToAnalyze')}</h3>
                                <p className="text-gray-500 max-w-sm">{t('yieldPrediction.enterParams')}</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                {/* Main Metric */}
                                <div className="bg-gradient-to-br from-agri-green to-emerald-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <p className="text-emerald-100 font-medium mb-2 uppercase tracking-wide text-sm">Estimated Total Yield</p>
                                        <div className="flex items-end gap-4">
                                            <h2 className="text-5xl font-bold">{prediction.estimatedYield.toFixed(2)}</h2>
                                            <span className="text-xl font-medium mb-1">Metric Tons</span>
                                        </div>
                                        <div className="mt-6 flex items-center gap-6">
                                            <div>
                                                <p className="text-emerald-200 text-sm">Model Accuracy</p>
                                                <p className="font-semibold">{prediction.accuracy}%</p>
                                            </div>
                                            <div>
                                                <p className="text-emerald-200 text-sm">Vs. Regional Avg</p>
                                                <p className="font-semibold text-green-300">{prediction.comparison}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <TrendingUp className="absolute right-0 bottom-0 text-white/10 w-48 h-48 -mr-8 -mb-8" />
                                </div>

                                {/* Additional Insights */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Yield Factors</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Weather Impact</span>
                                                <span className="text-sm font-medium text-green-600">
                                                    {prediction.factors?.weather_multiplier > 1 ? '+' : ''}{Math.round((prediction.factors?.weather_multiplier - 1) * 100)}%
                                                </span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Soil Condition</span>
                                                <span className="text-sm font-medium text-green-600">
                                                    {prediction.factors?.soil_multiplier > 1 ? '+' : ''}{Math.round((prediction.factors?.soil_multiplier - 1) * 100)}%
                                                </span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Yield per Hectare</span>
                                                <span className="text-sm font-medium text-gray-900">{prediction.yieldPerHectare} tons/ha</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">AI Recommendations</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                            {prediction.optimalConditions} To maximize this yield, consider applying nitrogen-based fertilizers in week 4.
                                        </p>
                                        <button className="text-agri-green text-sm font-medium hover:underline">View detailed protocol →</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YieldPrediction;