import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, ArrowRight, Store, Tractor, Phone, Loader, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'farmer'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();
    const { t } = useTranslation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!formData.email && !formData.phone) {
            setError("Please provide either email or phone number");
            return;
        }

        setLoading(true);

        const userData = {
            name: formData.name,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            password: formData.password,
            role: formData.role
        };

        const res = await register(userData);

        if (res?.success) {
            navigate('/dashboard');
        } else {
            setError(res?.error || "Registration failed. Please try again.");
        }

        setLoading(false);
    };

    const roles = [
        { key: 'farmer', icon: Leaf, label: 'Farmer', desc: 'Sell produce & rent equipment' },
        { key: 'dealer', icon: Tractor, label: 'Dealer', desc: 'List equipment for rent' },
        { key: 'customer', icon: Store, label: 'Customer', desc: 'Buy produce & services' },
    ];

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full">
                
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Leaf className="w-8 h-8 text-agri-green" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{t('register.title')}</h1>
                    <p className="mt-3 text-gray-600">
                        {t('register.hasAccount')}{' '}
                        <Link to="/login" className="text-agri-green font-semibold hover:text-agri-dark transition-colors">
                            {t('register.signInLink')}
                        </Link>
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                            <span className="flex-shrink-0">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t('register.nameLabel')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder={t('register.namePlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t('register.passwordLabel')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder={t('register.passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {t('register.roleLabel')}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map(({ key, icon: Icon, label, desc }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: key })}
                                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                                            formData.role === key
                                                ? 'border-agri-green bg-green-50 shadow-sm'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 mx-auto mb-1 ${
                                            formData.role === key ? 'text-agri-green' : 'text-gray-400'
                                        }`} />
                                        <p className={`text-xs font-semibold ${
                                            formData.role === key ? 'text-agri-green' : 'text-gray-600'
                                        }`}>
                                            {label}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {roles.find(r => r.key === formData.role)?.desc}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-agri-green text-white rounded-xl font-semibold text-base hover:bg-agri-dark transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    {t('register.createButton')}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-gray-500 text-center">
                            By registering, you agree to our{' '}
                            <Link to="/terms" className="text-agri-green hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-agri-green hover:underline">Privacy Policy</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;