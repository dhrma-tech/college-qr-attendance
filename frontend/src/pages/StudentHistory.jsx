import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    History, CheckCircle, AlertTriangle, 
    Book, Calendar, Clock, ChevronRight, 
    Activity, ShieldCheck, Download, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const StudentHistory = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null); // { overall, subjects, totalClasses }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [historyRes, statsRes] = await Promise.all([
                    api.get('/attendance/student/history'),
                    api.get('/attendance/student/stats'),
                ]);
                setHistory(historyRes.data);
                setStats(statsRes.data);
            } catch (err) {
                toast.error('Identity ledger sync failed');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleExportPDF = () => {
        toast('PDF export coming soon!', { icon: '📄' });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-slate-100 border-t-primary-600 rounded-full" />
        </div>
    );

    const overallPct = stats?.overall ?? 0;
    const overallIsLow = overallPct < 75;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Ledger</h1>
                    <p className="text-sm font-medium text-slate-500">Cryptographically verified attendance records</p>
                </div>
                <button onClick={handleExportPDF} className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10">
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            {/* Overall Analytics Hero */}
            {stats && (
                <div className={`relative overflow-hidden p-8 rounded-[40px] ${overallIsLow ? 'bg-red-600' : 'bg-slate-900'} text-white`}>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Big % gauge */}
                        <div className="flex-shrink-0 flex items-center gap-6">
                            <div className="relative w-28 h-28">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <motion.circle
                                        cx="50" cy="50" r="42"
                                        fill="none"
                                        stroke={overallIsLow ? '#fca5a5' : '#a78bfa'}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 42}`}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overallPct / 100) }}
                                        transition={{ duration: 1.4, ease: 'easeOut' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-3xl font-black leading-none">{overallPct}<span className="text-sm">%</span></p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50 mb-1">Overall Attendance</p>
                                <p className="text-2xl font-black tracking-tight">
                                    {overallIsLow ? 'Below Threshold' : 'On Protocol'}
                                </p>
                                <p className="text-xs text-white/60 font-bold mt-1">{stats.totalClasses} total classes logged</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-20 bg-white/10" />

                        {/* Subject mini-bars */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {stats.subjects?.slice(0, 4).map((subj) => (
                                <div key={subj.code} className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70 truncate pr-2">{subj.name}</p>
                                        <p className={`text-xs font-black flex-shrink-0 ${subj.percentage < 75 ? 'text-red-300' : 'text-emerald-300'}`}>{subj.percentage}%</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${subj.percentage < 75 ? 'bg-red-400' : 'bg-emerald-400'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subj.percentage}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Status badge */}
                        <div className="flex-shrink-0">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${overallIsLow ? 'bg-red-400/20 border-red-300/30 text-red-100' : 'bg-emerald-400/20 border-emerald-300/30 text-emerald-100'}`}>
                                {overallIsLow ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                {overallIsLow ? 'At Risk' : 'Compliant'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Per-Subject Matrix */}
            {stats?.subjects?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {stats.subjects.map((subj, index) => {
                        const isLow = subj.percentage < 75;
                        return (
                            <motion.div 
                                key={subj.code} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/20 group hover:border-primary-100 transition-all relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 ${isLow ? 'bg-red-50' : 'bg-emerald-50'}`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl ${isLow ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'}`}>
                                            <Book className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isLow ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                {isLow ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                                {isLow ? 'LOW' : 'STABLE'}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors truncate">{subj.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{subj.code}</p>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Marked Ratio</p>
                                                <p className="text-2xl font-black text-slate-900">{subj.present}<span className="text-slate-300 text-lg">/{subj.total}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[32px] font-black text-slate-900 leading-none">{subj.percentage}<span className="text-sm">%</span></p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subj.percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                                                className={`h-full ${isLow ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Chronological Feed */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History className="w-6 h-6 text-primary-600" />
                        Verification History
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">End-to-End Encrypted</span>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Segment</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Primary</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map((record, index) => (
                                    <motion.tr 
                                        key={record._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-10 py-6 font-bold text-slate-900">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-slate-900/10 group-hover:bg-primary-600 transition-colors">
                                                    {record.session?.subject?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="tracking-tight">{record.session?.subject?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Division {record.session?.division}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-sm font-black text-slate-600">
                                            {record.session?.teacher?.name}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className="text-sm font-black text-slate-900">
                                                    {new Date(record.markedAt).toLocaleString([], { dateStyle: 'medium' })}
                                                </p>
                                                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-widest">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    {new Date(record.markedAt).toLocaleTimeString([], { timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {history.length === 0 && (
                        <div className="text-center py-32 bg-slate-50/30">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm opacity-20">
                                <Activity className="w-10 h-10 text-slate-900" />
                            </div>
                            <p className="font-black text-xs text-slate-400 uppercase tracking-[0.3em]">No Verification Logs Detected</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Warning Shield */}
            <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                <div className="flex gap-8 items-start relative z-10">
                    <div className="p-4 bg-white/10 rounded-[24px] border border-white/10 shadow-2xl">
                        <AlertTriangle className="w-8 h-8 text-primary-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black tracking-tight mb-2">Protocol Requirement: 75% Verification</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-bold max-w-3xl">
                            Attendance maintenance is a prerequisite for examination authorization. 
                            Modules falling below the <span className="text-primary-400">75 percentile threshold</span> will trigger access restrictions on the examination portal. 
                            Contact the respective Node Head (HOD) for clarification on discrepancy logs.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentHistory;
