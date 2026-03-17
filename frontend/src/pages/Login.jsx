import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, Lock, Mail, AlertCircle, ChevronRight, UserCheck, GraduationCap, Shield, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email, password);
            toast.success('Welcome back!');
            
            // Direct redirect based on role if no 'from' or if 'from' is just dashboard
            if (!location.state?.from || from === '/dashboard') {
                if (user.role === 'admin') navigate('/admin/users');
                else if (user.role === 'hod') navigate('/hod/dashboard');
                else if (user.role === 'teacher') navigate('/teacher/sessions');
                else if (user.role === 'student') navigate('/student/scan');
                else navigate('/dashboard');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            toast.error('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl"
                />
                <motion.div 
                    animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"
                />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl border border-slate-100 mb-6">
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <QrCode className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        College Attendance<span className="text-primary-600">.</span>
                    </h2>
                    <p className="mt-3 text-slate-500 font-medium tracking-wide uppercase text-[10px]">
                        QR Attendance System
                    </p>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-[440px] px-6"
            >
                <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl shadow-primary-200/20 sm:rounded-[32px] sm:px-12 border border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl shadow-xl shadow-primary-200/50 bg-primary-600 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? 'Signing In...' : 'Sign In'}
                                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>

                        <div className="text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    Create account
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
