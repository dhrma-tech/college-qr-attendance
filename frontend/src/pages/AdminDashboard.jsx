import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { 
    Users, BookOpen, Clock, CheckCircle, 
    GraduationCap, Building, TrendingUp,
    ChevronRight, Sparkles, Activity
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalDepartments: 0,
        activeSessions: 0
    });
    const [activeSessions, setActiveSessions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, sessionsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/attendance/sessions')
                ]);
                setStats(statsRes.data);
                setActiveSessions(sessionsRes.data.filter(s => s.active).slice(0, 3));
            } catch (err) {
                console.error('Failed to sync admin telemetry:', err);
            }
        };
        fetchData();
    }, []);

    const attendanceData = stats.attendanceData || [];


    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/20 group hover:border-primary-100 transition-all duration-300"
        >
            <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${color} shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <p className="text-sm font-medium text-slate-500 tracking-wide">Real-time analytical telemetry for Institutional Nodes</p>
                    </div>
                </div>
                <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white flex items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node: Central</span>
                    </div>
                </div>
            </div>

            {/* Metrics Cluster */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={GraduationCap} 
                    color="bg-slate-900 text-white" 
                    delay={0.1}
                />
                <StatCard 
                    title="Faculty Nodes" 
                    value={stats.totalTeachers} 
                    icon={Users} 
                    color="bg-primary-600 text-white" 
                    delay={0.2}
                />
                <StatCard 
                    title="Departments" 
                    value={stats.totalDepartments} 
                    icon={Building} 
                    color="bg-indigo-600 text-white" 
                    delay={0.3}
                />
                <StatCard 
                    title="Live Sessions" 
                    value={stats.activeSessions} 
                    icon={TrendingUp} 
                    color="bg-emerald-600 text-white" 
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Visual Intelligence Center */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="xl:col-span-8 bg-white/80 backdrop-blur-xl p-8 rounded-[48px] border border-white shadow-2xl shadow-primary-200/10"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-50 p-2 rounded-xl border border-primary-100">
                                <Activity className="w-5 h-5 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Vectors</h3>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                            {['7D', '30D', 'ALL'].map(t => (
                                <button key={t} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${t === '7D' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceData}>
                                <defs>
                                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                                    domain={[0, 100]}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                        padding: '12px 16px'
                                    }}
                                    cursor={{ stroke: '#0ea5e9', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="attendance" 
                                    stroke="#0ea5e9" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorAtt)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Operations Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors" />
                        
                        <div className="relative z-10">
                            <h3 className="text-lg font-black tracking-tight mb-8 flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-primary-400" />
                                Active Broadcasts
                            </h3>
                            <div className="space-y-4">
                                {activeSessions.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Active Sessions</p>
                                        <p className="text-slate-600 text-[10px] mt-1 opacity-60">Broadcasts will appear here</p>
                                    </div>
                                ) : (
                                    activeSessions.map((s) => (
                                        <div key={s._id} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group/item">
                                            <div className="w-12 h-12 bg-white/5 text-primary-400 rounded-2xl flex items-center justify-center font-black group-hover/item:bg-primary-600 group-hover/item:text-white transition-colors text-xs">
                                                {s.subject?.code?.slice(0, 2) || 'SB'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm tracking-tight truncate">{s.subject?.name || 'Subject'}</p>
                                                <p className="text-[10px] font-medium text-slate-400">Div {s.division}</p>
                                            </div>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mt-2" />
                                        </div>
                                    ))
                                )}
                            </div>
                            <button className="w-full mt-8 py-4 bg-white/10 text-white rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                System Audit
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/20"
                    >
                        <h3 className="font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-primary-600" />
                            Node Status
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Main DB Cluster', status: 'Optimal', color: 'bg-emerald-500' },
                                { name: 'QR Encryption Engine', status: 'Optimal', color: 'bg-emerald-500' },
                                { name: 'Token Generator', status: 'Active', color: 'bg-primary-500' },
                            ].map((node) => (
                                <div key={node.name} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${node.color}`} />
                                        <span className="text-xs font-bold text-slate-700">{node.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{node.status}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
