import { useNavigate } from 'react-router-dom';
import { QrCode, LogIn, Users, GraduationCap, Shield, Mail, Lock, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    const credentials = [
        {
            role: 'System Admin',
            email: 'admin@college.edu',
            password: 'password123',
            icon: Shield,
            color: 'bg-purple-600',
            description: 'Manage users, departments, courses, and subjects'
        },
        {
            role: 'HOD',
            email: 'hod@college.edu',
            password: 'password123',
            icon: GraduationCap,
            color: 'bg-blue-600',
            description: 'View departmental reports and faculty performance'
        },
        {
            role: 'Teacher',
            email: 'alan@college.edu',
            password: 'password123',
            icon: BookOpen,
            color: 'bg-green-600',
            description: 'Create attendance sessions and manage student records'
        },
        {
            role: 'Student',
            email: 'student1@college.edu',
            password: 'password123',
            icon: Users,
            color: 'bg-orange-600',
            description: 'Mark attendance using QR codes and view history'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <QrCode className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900">Gatekeeper</h1>
                            <p className="text-xs text-slate-500">QR Attendance Protocol</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </motion.button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-5xl font-black text-slate-900 mb-6">
                            Welcome to <span className="text-primary-600">Gatekeeper</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            College QR Attendance System - Modern, secure, and efficient attendance tracking for educational institutions
                        </p>
                    </motion.div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: QrCode, title: 'QR-Based Attendance', desc: 'Secure and instant attendance marking using QR codes' },
                        { icon: Shield, title: 'Role-Based Access', desc: 'Different interfaces for admin, HOD, teachers, and students' },
                        { icon: BookOpen, title: 'Real-time Reports', desc: 'Generate attendance reports and analytics instantly' }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50"
                        >
                            <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Login Credentials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Demo Login Credentials</h3>
                        <p className="text-slate-600">Use these credentials to explore different user roles</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {credentials.map((cred, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200/50 hover:shadow-lg transition-shadow"
                            >
                                <div className={`${cred.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                                    <cred.icon className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{cred.role}</h4>
                                <p className="text-xs text-slate-600 mb-4">{cred.description}</p>
                                
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span className="font-mono text-slate-700">{cred.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-3 h-3 text-slate-400" />
                                        <span className="font-mono text-slate-700">{cred.password}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className="w-full mt-4 bg-slate-900 text-white py-2 rounded-xl font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                                >
                                    Login as {cred.role}
                                    <ChevronRight className="w-3 h-3" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            All accounts use password: <span className="font-mono bg-green-100 px-2 py-1 rounded">password123</span>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium ml-2">
                            <Lock className="w-4 h-4" />
                            Teacher Passkey: <span className="font-mono bg-blue-100 px-2 py-1 rounded">teach123</span>
                        </div>
                    </div>
                </motion.div>

                {/* Register Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-3xl p-8 border border-primary-200/50">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">New to the System?</h3>
                        <p className="text-slate-600 mb-6">Create a new account to get started with the QR attendance system</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/register')}
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                        >
                            Create New Account
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;
