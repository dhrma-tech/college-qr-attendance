import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Users, Clock, AlertCircle, 
    ShieldCheck, Activity, Copy, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';

const LiveSession = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const [sessionRes, attendeesRes] = await Promise.all([
                    api.get(`/attendance/teacher/sessions`),
                    api.get(`/attendance/session/${id}/records`)
                ]);
                
                const currentSession = sessionRes.data.find(s => s._id === id);
                setSession(currentSession);
                setAttendees(attendeesRes.data);

                if (currentSession) {
                    const expiry = new Date(currentSession.endTime).getTime();
                    const now = new Date().getTime();
                    setTimeLeft(Math.max(0, Math.floor((expiry - now) / 1000)));
                }
            } catch (err) {
                // Background polling errors shouldn't disrupt the UI unless it's the first load
                if (loading) toast.error('Connection lost');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
        const interval = setInterval(fetchSessionData, 5000); 
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToken = () => {
        navigator.clipboard.writeText(session.sessionToken);
        setCopied(true);
        toast.success('Token copied for manual scan');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full"
            />
            <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing API...</p>
        </div>
    );

    if (!session) return (
        <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Session Terminated</h2>
            <p className="text-slate-500 mt-2">The requested attendance session is no longer available.</p>
            <Link to="/teacher/sessions" className="mt-6 inline-block text-primary-600 font-bold underline">Return to Dashboard</Link>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 min-h-screen pb-20"
        >
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link to="/teacher/sessions">
                        <motion.div 
                            whileHover={{ scale: 1.1, x: -5 }}
                            className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </motion.div>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{session.subject?.name}</h1>
                            <span className="bg-primary-50 text-primary-700 text-[10px] font-black px-2.5 py-1 rounded-lg border border-primary-100 uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 text-xs">Div {session.division}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-sm">Attendance Protocol Activated</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white">
                    <div className="px-4 py-2 bg-slate-900 rounded-xl text-white">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-tight">Uptime</p>
                        <p className="text-lg font-mono font-bold">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="px-5 py-2">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-tight">Status</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <motion.div 
                                animate={{ opacity: [1, 0.4, 1] }} 
                                transition={{ duration: 1, repeat: Infinity }}
                                className={`w-2 h-2 rounded-full ${timeLeft > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            />
                            <span className={`text-[10px] font-black uppercase ${timeLeft > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {timeLeft > 0 ? 'Protocol Active' : 'Expired'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Identification Core (QR) */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-2xl shadow-primary-200/20 relative overflow-hidden group"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 border border-slate-100 z-0"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-50 rounded-full -ml-16 -mb-16 blur-3xl z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-white p-6 rounded-[40px] shadow-sm border-8 border-slate-50 group-hover:border-primary-50 transition-all duration-700">
                                <QRCode 
                                    value={session.sessionToken} 
                                    size={240}
                                    level="H"
                                    fgColor="#0f172a"
                                />
                            </div>

                            <div className="mt-10 w-full space-y-4">
                                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Session Token Identification</p>
                                <div 
                                    onClick={copyToken}
                                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group/token"
                                >
                                    <code className="text-[10px] font-mono font-bold text-slate-500 truncate mr-4">
                                        {session.sessionToken}
                                    </code>
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-300 group-hover/token:text-primary-600" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-xl">
                                    <Activity className="w-5 h-5 text-primary-400" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-primary-400">Live Analytics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Presence</p>
                                    <p className="text-3xl font-black">{attendees.length}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Health</p>
                                    <p className="text-3xl font-black text-emerald-400 leading-none">100<span className="text-sm border-none">%</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Presence Feed */}
                <div className="lg:col-span-12 xl:col-span-8">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col h-full min-h-[600px]">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Real-time Presence Feed</h2>
                                <p className="text-xs text-slate-500 font-medium">Monitoring incoming cryptographic scans</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div 
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-primary-600 rounded-full"
                                />
                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Broadcasting</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <div className="space-y-2">
                                <AnimatePresence initial={false}>
                                    {attendees.map((record, index) => (
                                        <motion.div 
                                            key={record._id}
                                            initial={{ opacity: 0, x: -20, height: 0 }}
                                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 p-4 rounded-2xl flex items-center justify-between transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-lg group-hover:bg-primary-600 transition-colors">
                                                    {record.student?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm tracking-tight">{record.student?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase truncate max-w-[120px]">
                                                        {record.student?.studentDetails?.rollNumber}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-8">
                                                <div className="hidden md:block">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase text-right leading-none mb-1">Status</p>
                                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Verified
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase text-right leading-none mb-1">Timestamp</p>
                                                    <p className="text-sm font-black text-slate-900">
                                                        {new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )).reverse()}
                                </AnimatePresence>

                                {attendees.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                            <Users className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-[0.3em] opacity-40">Waiting for data Scans</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LiveSession;
