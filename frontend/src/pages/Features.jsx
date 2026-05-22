import { Cpu, TrendingUp, Leaf, LineChart, MapPin, MessageSquare, Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
    return (
        <div className="bg-white min-h-screen pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-green to-emerald-600">Features</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        Discover the comprehensive suite of tools AgriSmart provides for farmers, customers, and equipment dealers. Everything you need to thrive in modern agriculture.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Feature: AI Disease Prediction */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Cpu className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Disease Prediction</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Protect your crops with our advanced AI vision model. Simply upload a photo of a sick plant, and our system will instantly diagnose the disease and provide actionable treatment recommendations to prevent spread and save your harvest.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Yield Prediction */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Yield Prediction & Analytics</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Remove the guesswork from your harvest. By analyzing historical data, weather patterns, and specific soil conditions, our machine learning models estimate your crop yield, helping you plan your supply chain and finances better.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Seasonal Recommendations */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Leaf className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Seasonal Recommendations</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Maximize your land's potential with tailored crop suggestions. We consider your geographical location, soil characteristics, and the current season to recommend the most profitable and thriving crops for your specific farm.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Market Prices */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LineChart className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-time Market Prices</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Stay informed and negotiate better. Access live market prices for various commodities across different regions. Track trends to decide the best time to sell your produce for maximum profit.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Store Locator */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Store Locator</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Connect directly with buyers. Customers can easily find your farm or physical store using our interactive map. Enhance local sales by bridging the gap between farmers and consumers in your targeted area.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Community & Support */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-8 h-8 text-agri-green" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Blog & Chatbot</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Learn from experts and peers in our agricultural blog. Plus, our multilingual AI chatbot is available 24/7 to answer your farming questions, provide support, and guide you through the platform.
                            </p>
                        </div>
                    </div>

                    {/* Feature: Get Service (NEW) */}
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(251,146,60,0.12)] transition-all duration-300 group relative overflow-hidden sm:col-span-2">
                        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-white px-2 py-0.5 rounded-full">New</span>
                        <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Tractor className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Agricultural Equipment Service Marketplace</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Bridging the gap between machinery and farmers. <strong>Dealers</strong> can list tractors, drones, harvesters, sprayers, and other agricultural tools with daily rental rates. <strong>Farmers</strong> can browse the catalogue, filter by category or location, and submit service hire requests directly — getting instant access to equipment they would otherwise not own.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Tractors', 'Drones', 'Harvesters', 'Sprayers', 'Ploughs', 'Irrigation'].map(tag => (
                                    <span key={tag} className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-xl text-gray-600 mb-6">Ready to experience these features on your farm?</p>
                    <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-agri-green hover:bg-agri-dark transition shadow-lg hover:-translate-y-1 transform duration-200">
                        Join AgriSmart Today
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Features;
