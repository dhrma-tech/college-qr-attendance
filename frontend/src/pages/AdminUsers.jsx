import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    UserPlus, Search, UserCheck, Shield, 
    GraduationCap, Filter, 
    ChevronDown, Activity, Trash2, Edit3 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get(`/admin/users?role=${roleFilter}`);
                setUsers(data);
            } catch (err) {
                toast.error('Identity ledger retrieval failed');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [roleFilter]);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-slate-100 border-t-primary-600 rounded-full" />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Control Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Directory</h1>
                    <p className="text-sm font-medium text-slate-500">Manage institutional access nodes and verification roles</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all appearance-none pr-12 shadow-sm"
                        >
                            <option value="">All Protocol Roles</option>
                            <option value="admin">Administrators</option>
                            <option value="teacher">Faculty Nodes</option>
                            <option value="student">Student Nodes</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10"
                    >
                        <UserPlus className="w-5 h-5" />
                        Initialize Node
                    </motion.button>
                </div>
            </div>

            {/* Main Data Layer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cryptographic signatures (Name / Email / ID)..." 
                        className="flex-1 bg-transparent border-none text-sm font-bold placeholder-slate-400 focus:ring-0"
                    />
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                        <Filter className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filters Active</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Node</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Role</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((user, index) => (
                                    <motion.tr 
                                        layout
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-110 transition-transform ${
                                                    user.role === 'admin' ? 'bg-slate-900 shadow-slate-900/10' : 
                                                    user.role === 'teacher' ? 'bg-primary-600 shadow-primary-200' : 'bg-indigo-600 shadow-indigo-200'
                                                }`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 lowercase tracking-wide">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-slate-900" />}
                                                {user.role === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-primary-600" />}
                                                {user.role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-500 font-mono tracking-widest">
                                                    {user.role === 'student' ? user.studentDetails?.rollNumber : user.teacherDetails?.teacherId || 'SYS-ADMIN'}
                                                </span>
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">Verified Node</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-100 rounded-xl transition-all shadow-sm">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl transition-all shadow-sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm opacity-20">
                            <Activity className="w-10 h-10 text-slate-900" />
                        </div>
                        <p className="font-black text-xs text-slate-400 uppercase tracking-[0.3em]">No Identity Signatures found in query buffer</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminUsers;
