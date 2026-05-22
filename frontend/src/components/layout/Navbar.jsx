import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User as UserIcon, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'te', label: 'తెలుగు', short: 'TE' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const { user, isFarmer, isCustomer, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Leaf className="h-8 w-8 text-agri-green" />
                            <span className="font-bold text-xl text-gray-900 tracking-tight">AgriSmart</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {!user && (
                            <>
                                <Link to="/" className="text-gray-600 hover:text-agri-green font-medium transition-colors">{t('nav.home')}</Link>
                                <Link to="/features" className="text-gray-600 hover:text-agri-green font-medium transition-colors">{t('nav.features')}</Link>
                                <Link to="/blog" className="text-gray-600 hover:text-agri-green font-medium transition-colors">{t('nav.blog')}</Link>
                            </>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-4 ml-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-agri-green border border-gray-200 px-3 py-1.5 rounded-lg hover:border-agri-green transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                {currentLang.short}
                            </button>
                            {langOpen && (
                                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-xl border border-gray-100 w-36 py-1 z-50">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${i18n.language === lang.code ? 'text-agri-green font-semibold' : 'text-gray-700'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                    <UserIcon className="w-4 h-4" /> {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
                                >
                                    <LogOut className="w-4 h-4" /> {t('nav.logOut')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-agri-green font-medium transition-colors">{t('nav.login')}</Link>
                                <Link to="/register" className="bg-agri-green hover:bg-agri-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    {t('nav.getStarted')}
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
                        {!user && (
                            <>
                                <Link to="/" className="block px-3 py-2 rounded-md font-medium text-gray-900 hover:bg-gray-50">{t('nav.home')}</Link>
                                <Link to="/features" className="block px-3 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-50">{t('nav.features')}</Link>
                                <Link to="/blog" className="block px-3 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-50">{t('nav.blog')}</Link>
                            </>
                        )}
                        {/* Mobile Language Switcher */}
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Language</p>
                            <div className="flex gap-2">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${i18n.language === lang.code ? 'bg-agri-green text-white border-agri-green' : 'border-gray-200 text-gray-600 hover:border-agri-green hover:text-agri-green'}`}
                                    >
                                        {lang.short}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-medium text-gray-700">Logged in as {user.name}</div>
                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md font-medium text-red-600 hover:bg-gray-50">{t('nav.logOut')}</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-50">{t('nav.login')}</Link>
                                    <Link to="/register" className="block px-3 py-2 rounded-md font-medium text-agri-green hover:bg-gray-50">{t('nav.getStarted')}</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
