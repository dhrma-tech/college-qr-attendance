import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';
import { QrCode, ShieldCheck, AlertCircle, RefreshCcw, Camera, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const StudentScanner = () => {
    const [scanned, setScanned] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mockToken, setMockToken] = useState('');

    useEffect(() => {
        // Initialize scanner only when not scanned
        if (!scanned) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: { width: 250, height: 250 },
                fps: 5,
            });

            scanner.render(onScanSuccess, onScanError);

            function onScanSuccess(result) {
                scanner.clear();
                handleMarkAttendance(result);
            }

            function onScanError(err) {
                // Ignore scan errors as they occur frequently during scanning
            }

            return () => {
                scanner.clear();
            };
        }
    }, [scanned]);

    const handleMarkAttendance = async (token) => {
        setLoading(true);
        console.log('[StudentScanner] Attempting scan with token:', token?.substring(0, 10), '...');
        try {
            await api.post('/attendance/scan', {
                sessionToken: token,
                deviceFingerprint: navigator.userAgent
            });
            setError(null);
            setScanned(true);
            toast.success('Attendance marked!');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
            setScanned(true);
            toast.error('Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleMockScan = (e) => {
        e.preventDefault();
        if (!mockToken) return toast.error('Enter a session token');
        handleMarkAttendance(mockToken);
    };

    const resetScanner = () => {
        setScanned(false);
        setError(null);
        setMockToken('');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto space-y-8"
        >
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Scan QR Code</h1>
                <p className="text-slate-500 font-medium">Scan the session QR code to mark attendance</p>
            </div>

            <AnimatePresence mode="wait">
                {!scanned ? (
                    <motion.div 
                        key="scanner"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-6"
                    >
                        {/* Camera Frame */}
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-2xl shadow-primary-200/20 overflow-hidden relative">
                            <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50"></div>
                            
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/50 rounded-[32px]"></div>
                        </div>

                        {/* Debug / Mock Utility */}
                        <div className="bg-indigo-50/50 p-6 rounded-[24px] border border-indigo-100 group">
                            <div className="flex items-center gap-3 mb-4">
                                <FlaskConical className="w-5 h-5 text-indigo-600" />
                                <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">Mock Scan Utility</span>
                            </div>
                            <form onSubmit={handleMockScan} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={mockToken}
                                    onChange={(e) => setMockToken(e.target.value)}
                                    placeholder="Paste session token here..."
                                    className="flex-1 px-4 py-2 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Verify'}
                                </button>
                            </form>
                            <p className="mt-3 text-[10px] text-indigo-400 font-medium leading-relaxed">
                                Use this if your camera isn't accessible. Copy the token from the Teacher's screen (the long string in the QR payload).
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-12 rounded-[40px] border text-center space-y-8 shadow-2xl ${
                            error 
                            ? 'bg-red-50/50 border-red-100 shadow-red-200/20' 
                            : 'bg-emerald-50/50 border-emerald-100 shadow-emerald-200/20'
                        } backdrop-blur-xl`}
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                                error ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                            }`}
                        >
                            {error ? <AlertCircle className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
                        </motion.div>
                        
                        <div className="space-y-2">
                            <h2 className={`text-3xl font-black ${error ? 'text-red-900' : 'text-emerald-900'}`}>
                                {error ? 'Access Denied' : 'Attendance Verified'}
                            </h2>
                            <p className={`text-lg font-medium ${error ? 'text-red-600/80' : 'text-emerald-600/80'}`}>
                                {error || 'Your attendance has been recorded for this session.'}
                            </p>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetScanner}
                            className="flex items-center gap-3 mx-auto bg-white px-8 py-3 rounded-2xl text-sm font-black text-slate-800 border border-slate-200 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50"
                        >
                            <RefreshCcw className="w-5 h-5 text-primary-600" />
                            Return to Scanner
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Privacy Shield */}
            <div className="bg-slate-900 p-8 rounded-[32px] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors"></div>
                <div className="flex gap-6 items-start relative z-10">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <Camera className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Secure Verification</p>
                        <p className="text-xs text-white/50 leading-relaxed">
                            Your attendance is securely validated using dynamic single-use tokens and
                            location proximity verification to ensure data integrity.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentScanner;
