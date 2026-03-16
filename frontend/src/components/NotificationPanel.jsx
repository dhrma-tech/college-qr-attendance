import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import { Bell, CheckCheck, X, Zap, Info, ShieldCheck, FileDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 30_000; // 30 seconds

const typeConfig = {
    session_started: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    attendance_marked: { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    report_exported: { icon: FileDown, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    system: { icon: Info, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch {
            // silently fail — don't interrupt the user
        }
    }, []);

    // Initial fetch + polling
    useEffect(() => {
        let isMounted = true;
        const fetchAndSet = async () => {
            if (!isMounted) return;
            await fetchNotifications();
        };

        fetchAndSet();
        const interval = setInterval(fetchAndSet, POLL_INTERVAL);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleMarkRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            toast.error('Could not mark as read.');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success('All caught up!');
        } catch {
            toast.error('Failed to update notifications.');
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Trigger */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(prev => !prev)}
                className="p-3 text-slate-400 hover:text-primary-600 bg-white/50 border border-white hover:border-primary-100 rounded-2xl relative transition-all shadow-sm"
                aria-label="Notifications"
                id="notification-bell-btn"
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm leading-none"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 top-[calc(100%+12px)] w-[360px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[28px] shadow-2xl shadow-slate-900/10 overflow-hidden z-50"
                        id="notification-dropdown"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex items-center gap-1.5 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
                                    id="mark-all-read-btn"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <Bell className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n) => {
                                        const cfg = typeConfig[n.type] || typeConfig.system;
                                        const Icon = cfg.icon;
                                        return (
                                            <motion.button
                                                key={n._id}
                                                onClick={() => !n.read && handleMarkRead(n._id)}
                                                className={`w-full text-left px-6 py-4 flex items-start gap-4 transition-colors hover:bg-slate-50/80 ${!n.read ? 'bg-primary-50/30' : ''}`}
                                                id={`notif-${n._id}`}
                                                layout
                                            >
                                                <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                                                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <p className={`text-xs font-black tracking-tight truncate ${n.read ? 'text-slate-500' : 'text-slate-900'}`}>
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap flex-shrink-0">
                                                            {timeAgo(n.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className={`text-[11px] mt-0.5 leading-relaxed line-clamp-2 ${n.read ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                                                        {n.message}
                                                    </p>
                                                </div>
                                                {!n.read && (
                                                    <div className="mt-2 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                                Showing last {notifications.length} alerts · Auto-refreshes every 30s
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
