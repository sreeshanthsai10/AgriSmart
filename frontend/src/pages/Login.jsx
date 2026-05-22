import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // 🔥 email OR phone
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { login, user } = useAuth();
    const { t } = useTranslation();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifier || !password) {
            alert("Provide email/phone and password");
            return;
        }

        const res = await login(identifier, password);

        if (res?.success) {
            navigate('/dashboard');
        } else {
            alert(res?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <Leaf className="mx-auto h-12 w-12 text-agri-green" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                        {t('login.title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('login.noAccount')}{' '}
                        <Link to="/register" className="font-medium text-agri-green hover:text-agri-dark transition-colors">
                            {t('login.signUpLink')}
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {/* 🔥 Email OR Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm"
                                    placeholder="Enter email or phone"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('login.passwordLabel')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm"
                                    placeholder={t('login.passwordPlaceholder')}
                                />
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-agri-green hover:bg-agri-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green transition-all shadow-md hover:shadow-lg"
                    >
                        {t('login.signIn')}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;