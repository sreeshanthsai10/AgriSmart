import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Leaf, TrendingUp, LineChart, Store, BookOpen, MapPin, Sun, Tractor, ClipboardList, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const { user, isFarmer, isCustomer, isDealer } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const baseLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ";
    const activeLinkClass = baseLinkClass + "bg-green-50 text-agri-green";
    const inactiveLinkClass = baseLinkClass + "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
            <div className="flex flex-col h-full sticky top-16 pt-6 px-6 pb-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('sidebar.mainMenu')}</p>
                <nav className="space-y-2">
                    <Link to="/dashboard" className={isActive('/dashboard') ? activeLinkClass : inactiveLinkClass}>
                        <LayoutDashboard className="w-5 h-5" /> {t('sidebar.dashboard')}
                    </Link>

                    {isFarmer && (
                        <>
                            <Link to="/disease-prediction" className={isActive('/disease-prediction') ? activeLinkClass : inactiveLinkClass}>
                                <Leaf className="w-5 h-5" /> {t('sidebar.diseasePredictor')}
                            </Link>
                            <Link to="/yield-prediction" className={isActive('/yield-prediction') ? activeLinkClass : inactiveLinkClass}>
                                <TrendingUp className="w-5 h-5" /> {t('sidebar.yieldAnalytics')}
                            </Link>
                            <Link to="/recommendations" className={isActive('/recommendations') ? activeLinkClass : inactiveLinkClass}>
                                <Sun className="w-5 h-5" /> {t('sidebar.seasonalAdvice')}
                            </Link>
                            <Link to="/market-prices" className={isActive('/market-prices') ? activeLinkClass : inactiveLinkClass}>
                                <LineChart className="w-5 h-5" /> {t('sidebar.marketPrices')}
                            </Link>
                            <Link to="/store-locator" className={isActive('/store-locator') ? activeLinkClass : inactiveLinkClass}>
                                <MapPin className="w-5 h-5" /> {t('sidebar.findStores')}
                            </Link>
                            <Link to="/blog" className={isActive('/blog') ? activeLinkClass : inactiveLinkClass}>
                                <BookOpen className="w-5 h-5" /> {t('sidebar.communityBlog')}
                            </Link>
                            <div className="pt-4 mt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('sidebar.management')}</p>
                                <Link to="/manage-store" className={isActive('/manage-store') ? activeLinkClass : inactiveLinkClass}>
                                    <Store className="w-5 h-5" /> {t('sidebar.myStoreProfile')}
                                </Link>
                                <Link to="/create-blog" className={isActive('/create-blog') ? activeLinkClass : inactiveLinkClass}>
                                    <BookOpen className="w-5 h-5" /> {t('sidebar.writeNewBlog')}
                                </Link>
                                <Link to="/get-service" className={isActive('/get-service') ? activeLinkClass : inactiveLinkClass}>
                                    <Tractor className="w-5 h-5" /> Get Service
                                </Link>
                            </div>
                        </>
                    )}

                    {isCustomer && (
                        <>
                            <Link to="/store-locator" className={isActive('/store-locator') ? activeLinkClass : inactiveLinkClass}>
                                <MapPin className="w-5 h-5" /> {t('sidebar.findStores')}
                            </Link>
                            <Link to="/blog" className={isActive('/blog') ? activeLinkClass : inactiveLinkClass}>
                                <BookOpen className="w-5 h-5" /> {t('sidebar.readBlogs')}
                            </Link>
                            <Link to="/get-service" className={isActive('/get-service') ? activeLinkClass : inactiveLinkClass}>
                                <Tractor className="w-5 h-5" /> Get Service
                            </Link>
                        </>
                    )}

                    {isDealer && (
                        <>
                            <div className="pt-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Dealer Tools</p>
                                <Link to="/dealer-equipment" className={isActive('/dealer-equipment') ? activeLinkClass.replace('text-agri-green', 'text-amber-600').replace('bg-green-50', 'bg-amber-50') : inactiveLinkClass}>
                                    <Wrench className="w-5 h-5" /> My Equipment
                                </Link>
                                <Link to="/service-requests" className={isActive('/service-requests') ? activeLinkClass.replace('text-agri-green', 'text-amber-600').replace('bg-green-50', 'bg-amber-50') : inactiveLinkClass}>
                                    <ClipboardList className="w-5 h-5" /> Service Requests
                                </Link>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
