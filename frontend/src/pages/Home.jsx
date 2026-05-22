import { ArrowRight, Cpu, TrendingUp, Leaf, Tractor } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const Home = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-green-50 to-white pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                            <Trans i18nKey="home.heroTitle" components={[<span key="1" className="text-transparent bg-clip-text bg-gradient-to-r from-agri-green to-emerald-600" />]} />
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
                            {t('home.heroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-agri-green hover:bg-agri-dark transition shadow-[0_8px_30px_rgb(46,204,113,0.3)] hover:shadow-[0_8px_40px_rgb(46,204,113,0.4)] hover:-translate-y-1 transform duration-200">
                                {t('home.startFree')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/features" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition hover:-translate-y-1 transform duration-200">
                                {t('home.exploreFeatures')}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                    <div className="w-96 h-96 bg-agri-green/10 rounded-full blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                    <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-24 bg-white relative -mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">{t('home.featuresHeading')}</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{t('home.featuresSubheading')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Cpu className="w-7 h-7 text-agri-green" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.diseasePredictionTitle')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('home.diseasePredictionDesc')}</p>
                            <Link to="/features" className="inline-flex items-center text-agri-green font-semibold hover:text-agri-dark">{t('home.learnMore')} <ArrowRight className="ml-1 w-4 h-4" /></Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-agri-green" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.yieldPredictionTitle')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('home.yieldPredictionDesc')}</p>
                            <Link to="/features" className="inline-flex items-center text-agri-green font-semibold hover:text-agri-dark">{t('home.learnMore')} <ArrowRight className="ml-1 w-4 h-4" /></Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Leaf className="w-7 h-7 text-agri-green" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.recommendationsTitle')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('home.recommendationsDesc')}</p>
                            <Link to="/features" className="inline-flex items-center text-agri-green font-semibold hover:text-agri-dark">{t('home.learnMore')} <ArrowRight className="ml-1 w-4 h-4" /></Link>
                        </div>

                        {/* Feature 4 – Get Service (NEW) */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(251,146,60,0.15)] transition-all duration-300 group relative overflow-hidden">
                            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-white px-2 py-0.5 rounded-full">New</span>
                            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Tractor className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Equipment Service</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Rent tractors, drones, harvesters and more from verified local dealers. Dealers list tools; farmers request on-demand hire — bridging machinery gaps instantly.</p>
                            <Link to="/register" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-800">Get Started <ArrowRight className="ml-1 w-4 h-4" /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 max-w-full"><div className="absolute rounded-full bg-agri-green/20 blur-3xl w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('home.ctaTitle')}</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">{t('home.ctaSubtitle')}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-gray-900 bg-white hover:bg-gray-50 transition duration-200">
                            {t('home.createAccount')}
                        </Link>
                        <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-transparent border border-gray-700 hover:bg-gray-800 transition duration-200">
                            {t('home.talkToSales')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
