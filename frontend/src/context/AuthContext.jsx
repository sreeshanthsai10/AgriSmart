import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD FROM LOCALSTORAGE
    // =========================
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }

        setLoading(false);
    }, []);

    // =========================
    // REGISTER
    // =========================
    const register = async (userData) => {
        try {
            const res = await API.post('/auth/register', userData);

            const { user, token } = res.data;

            setUser(user);
            setToken(token);

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // =========================
    // LOGIN
    // =========================
    const login = async (identifier, password) => {
        try {
            const res = await API.post('/auth/login', {
                identifier,
                password
            });

            const { user, token } = res.data;

            setUser(user);
            setToken(token);

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // =========================
    // LOGOUT
    // =========================
    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        window.location.href = '/login'; //  force redirect
    };

    // =========================
    // AUTO LOGOUT ON 401 (SYNC WITH API)
    // =========================
    useEffect(() => {
        const interceptor = API.interceptors.response.use(
            (res) => res,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            API.interceptors.response.eject(interceptor);
        };
    }, []);

    // =========================
    // ROLES
    // =========================
    const isFarmer = user?.role === 'farmer';
    const isCustomer = user?.role === 'customer';
    const isDealer = user?.role === 'dealer';
    const isAdmin = user?.role === 'admin';

    // =========================
    // PROVIDER
    // =========================
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isFarmer,
                isCustomer,
                isDealer,
                isAdmin,
                loading
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};