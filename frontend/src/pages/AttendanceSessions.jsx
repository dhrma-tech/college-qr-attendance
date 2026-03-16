import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Clock, Plus, StopCircle, 
    BookOpen, Play, 
    X, Calendar, ChevronRight, Activity, ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AttendanceSessions = () => {
    const location = useLocation();
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [subjectId, setSubjectId] = useState(location.state?.subjectId || '');
    const [division, setDivision] = useState('A');
    const [duration, setDuration] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, profileRes] = await Promise.all([
                    api.get('/attendance/teacher/sessions'),
                    api.get('/auth/profile')
                ]);
                setSessions(sessionsRes.data);
                setSubjects(profileRes.data.details.subjects || []);
            } catch (err) {
                toast.error('Failed to load session encrypted stream');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/attendance/session', {
                subjectId,
                division,
                durationMinutes: duration
            });
            setSessions([data, ...sessions]);
            setShowForm(false);
            toast.success('Session broadcast started');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Protocol failure');
        }
    };

    const handleEndSession = async (id) => {
        try {
            await api.put(`/attendance/session/${id}/end`);
            setSessions(sessions.map(s => s._id === id ? { ...s, active: false } : s));
            toast.success('Protocol terminated');
        } catch (err) {
            toast.error('Termination failed');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-slate-100 border-t-primary-600 rounded-full" />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Protocols</h1>
                    <p className="text-sm font-medium text-slate-500">Manage live QR attendance broadcast sessions</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10"
                >
                    {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showForm ? 'Close Portal' : 'Initialize Session'}
                </motion.button>
            </div>

            {/* Session Creation Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-8 rounded-[40px] border border-primary-100 shadow-2xl shadow-primary-200/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 blur-2xl" />
                            
                            <form onSubmit={handleCreateSession} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Subject</label>
                                    <select 
                                        value={subjectId}
                                        onChange={(e) => setSubjectId(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select Target...</option>
                                        {subjects.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Division Segment</label>
                                    <input 
                                        type="text"
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        placeholder="e.g. A"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                                    <input 
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit" 
                                        className="w-full bg-primary-600 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Launch
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {sessions.map((session) => (
                        <motion.div 
                            layout
                            key={session._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group bg-white rounded-[32px] border border-slate-200 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-primary-100 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Card Background Accent */}
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 transform group-hover:scale-150 ${
                                session.active ? 'bg-primary-50 opacity-100' : 'bg-slate-50 opacity-40'
                            }`} />

                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${session.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-400'}`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {session.active && (
                                            <motion.div 
                                                animate={{ opacity: [1, 0, 1] }} 
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="w-1.5 h-1.5 bg-emerald-500 rounded-full" 
                                            />
                                        )}
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                                            session.active ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>
                                            {session.active ? 'Active' : 'Terminated'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">{session.subject?.name}</h3>
                                    <div className="flex items-center gap-3 mt-1 underline decoration-slate-200 underline-offset-4 decoration-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Division {session.division}</span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.subject?.code}</span>
                                    </div>
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Timestamp</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                            {new Date(session.startTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Marked Count</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Activity className="w-3.5 h-3.5 text-slate-300" />
                                            0 Verified
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-2">
                                    {session.active ? (
                                        <>
                                            <Link 
                                                to={`/teacher/session/${session._id}`}
                                                className="flex-[2] bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                Command View
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleEndSession(session._id)}
                                                className="flex-1 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                                title="Emergency Termination"
                                            >
                                                <StopCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full bg-slate-50 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center border border-slate-100 flex items-center justify-center gap-2">
                                            <ShieldCheck className="w-4 h-4 opacity-30" />
                                            Session Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {sessions.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                            <Clock className="w-8 h-8 text-slate-200" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 tracking-tight">System Ready for Launch</p>
                            <p className="text-sm text-slate-400 font-medium">No attendance sessions found in the current buffer.</p>
                        </div>
                        <button 
                            onClick={() => setShowForm(true)}
                            className="text-primary-600 font-black text-xs uppercase tracking-widest hover:underline"
                        >
                            Initialize First Session
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default AttendanceSessions;
