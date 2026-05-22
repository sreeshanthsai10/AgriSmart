import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    if (user) return null;

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 text-white">
                            <Lucide.Leaf className="h-8 w-8 text-agri-green" />
                            <span className="font-bold text-xl tracking-tight">AgriSmart</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm text-sm">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Lucide.Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Lucide.Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Lucide.Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('footer.features')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-400">{t('footer.diseasePrediction')}</li>
                            <li className="text-gray-400">{t('footer.yieldPrediction')}</li>
                            <li className="text-gray-400">{t('footer.marketPrices')}</li>
                            <li className="text-gray-400">{t('footer.cropRecommendations')}</li>
                            <li className="text-gray-400">{t('footer.storeLocator')}</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('footer.resources')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/blog" className="hover:text-agri-green transition-colors">{t('footer.blog')}</Link></li>
                            <li><Link to="/contact" className="hover:text-agri-green transition-colors">{t('footer.contactSupport')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
                    <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
