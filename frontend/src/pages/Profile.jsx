import { useAuth } from '../context/AuthContext';
import { 
    User, Mail, Shield, UserCheck, 
    GraduationCap, MapPin, Camera, Sparkles,
    Settings, Key, Smartphone, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-10 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Hub</h1>
                    <p className="text-sm font-medium text-slate-500">Manage your institutional credentials and security parameters</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary-600 transition-all hover:bg-slate-50">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10">
                        Update Protocol
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Identity Core */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-2xl shadow-primary-200/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="relative">
                                <div className="w-32 h-32 bg-slate-900 text-white rounded-[40px] flex items-center justify-center font-black text-4xl shadow-2xl shadow-slate-900/20 ring-4 ring-white">
                                    {user?.name.charAt(0)}
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg border-4 border-white"
                                >
                                    <Camera className="w-4 h-4" />
                                </motion.button>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <Sparkles className="w-3 h-3 text-primary-500" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{user?.role} NODE</p>
                                </div>
                            </div>

                            <div className="w-full pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Active</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Security</p>
                                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest">Level 1</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-primary-500/20 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-primary-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-primary-400">Institutional Shield</span>
                            </div>
                            <p className="text-sm font-bold leading-relaxed">
                                Your account is end-to-end encrypted and managed by the central College IT Directorate.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <Globe className="w-3 h-3" />
                                verified campus node
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information matrix */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Core Metadata</h3>
                            <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Request Modification</button>
                        </div>
                        <div className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {[
                                    { label: 'Full Denomination', val: user?.name, icon: User },
                                    { label: 'Network Endpoint', val: user?.email, icon: Mail },
                                    { label: 'Privilege Level', val: user?.role, icon: user?.role === 'student' ? GraduationCap : UserCheck },
                                    { label: 'Operational Zone', val: 'Main Campus, Block C', icon: MapPin },
                                ].map((item) => (
                                    <div key={item.label} className="space-y-3">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</p>
                                        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group/item hover:border-primary-100 transition-colors">
                                            <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400 group-hover/item:text-primary-600 transition-colors">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <p className="font-black text-slate-900 text-sm tracking-tight capitalize">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/10 flex items-start gap-5 hover:border-primary-100 transition-all group">
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 tracking-tight">Access Recovery</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Configure multi-factor authentication and recovery tokens.</p>
                                <button className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:underline">Manage Security</button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/10 flex items-start gap-5 hover:border-primary-100 transition-all group">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 tracking-tight">Active Sessions</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Monitoring 2 active institutional terminal logins.</p>
                                <button className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:underline">End All Nodes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
