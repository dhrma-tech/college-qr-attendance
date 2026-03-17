import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { 
    Users, BookOpen, 
    GraduationCap, Building, TrendingUp,
    Activity, ShieldCheck,
    UserCheck, 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';

const HODDashboard = () => {
    const [stats, setStats] = useState({
        totalFaculty: 0,
        totalStudents: 0,
        avgAttendance: 0,
        activeSessions: 0
    });
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, perfRes] = await Promise.all([
                    api.get('/hod/stats'),
                    api.get('/hod/faculty-performance')
                ]);
                setStats(statsRes.data || {});
                setPerformance(Array.isArray(perfRes.data) ? perfRes.data : []);
            } catch (err) {
                console.error('Failed to sync departmental node:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const departmentTrends = Array.isArray(stats?.departmentTrends) ? stats.departmentTrends : [];

    const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/10 group hover:border-primary-100 transition-all duration-300 relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 opacity-5 shadow-inner ${color}`} />
            <div className="flex flex-col gap-6 relative z-10">
                <div className={`p-4 rounded-2xl w-fit ${color} shadow-lg shadow-current/10`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12% vs last month
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* HOD Header Control Plate */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-125" />
                
                <div className="relative z-10 flex gap-8 items-center">
                    <div className="p-5 bg-white/10 rounded-[28px] border border-white/20 shadow-2xl backdrop-blur-md">
                        <Building className="w-10 h-10 text-primary-400" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight">Department Overview</h1>
                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                             Computer Science & Engineering
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            Live Tracking System
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all backdrop-blur-sm">
                        System Logs
                    </button>
                    <button className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Department Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    title="Total Faculty" 
                    value={stats.totalFaculty} 
                    icon={UserCheck} 
                    color="bg-slate-900" 
                    delay={0.1}
                />
                <StatCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={GraduationCap} 
                    color="bg-primary-600" 
                    delay={0.2}
                />
                <StatCard 
                    title="Dept. Attendance" 
                    value={`${stats.avgAttendance}%`} 
                    icon={Activity} 
                    color="bg-indigo-600" 
                    delay={0.3}
                />
                <StatCard 
                    title="Active Sessions" 
                    value={stats.activeSessions} 
                    icon={ShieldCheck} 
                    color="bg-emerald-600" 
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Faculty Engagement Matrix */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="xl:col-span-7 bg-white/80 backdrop-blur-xl p-10 rounded-[56px] border border-white shadow-2xl shadow-primary-200/5 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-5">
                            <div className="bg-primary-50 p-3 rounded-2xl border border-primary-100">
                                <Users className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Performance</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance marking rate per faculty</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} 
                                    domain={[0, 100]}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc', radius: 12}}
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                                        padding: '16px 24px'
                                    }}
                                />
                                <Bar dataKey="attendance" fill="#0ea5e9" radius={[12, 12, 4, 4]} barSize={40}>
                                    {performance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-50">
                        {performance.map((f, i) => (
                            <div key={f.name || `perf-${i}`} className="text-center group cursor-default">
                                <p className="text-[20px] font-black text-slate-900 transition-transform group-hover:scale-110">{f.attendance}%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{f.name}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Periodic Attendance Flow */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="xl:col-span-5 flex flex-col gap-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[56px] border border-white shadow-2xl shadow-indigo-200/5 flex-1">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                                <Activity className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Trends</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly department attendance</p>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={departmentTrends}>
                                    <defs>
                                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="week" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                                        domain={[0, 100]}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="attendance" 
                                        stroke="#6366f1" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorTrend)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[56px] border border-slate-200 shadow-xl shadow-slate-200/10">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight mb-8">System Status</h4>
                        <div className="space-y-6">
                            {[
                                { label: 'Security', status: 'Optimal', col: 'emerald' },
                                { label: 'Database Sync', status: 'Syncing', col: 'indigo' },
                                { label: 'Network Connection', status: 'Optimal', col: 'emerald' },
                            ].map((node) => (
                                <div key={node.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full bg-${node.col}-500 animate-pulse`} />
                                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{node.label}</span>
                                    </div>
                                    <span className={`text-[8px] font-black px-2 py-1 bg-${node.col}-50 text-${node.col}-600 rounded-lg border border-${node.col}-100`}>
                                        {node.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HODDashboard;
