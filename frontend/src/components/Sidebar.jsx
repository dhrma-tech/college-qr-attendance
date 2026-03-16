import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Users, BookOpen, Clock, 
    QrCode, History, UserCircle, LogOut, Building,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getLinks = () => {
        if (!user) return [];
        
        const common = [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ];

        const adminLinks = [
            { name: 'Departments', path: '/admin/departments', icon: Building },
            { name: 'Courses', path: '/admin/courses', icon: Users },
            { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
            { name: 'Users', path: '/admin/users', icon: Users },
        ];

        const teacherLinks = [
            { name: 'My Subjects', path: '/teacher/subjects', icon: BookOpen },
            { name: 'Attendance Sessions', path: '/teacher/sessions', icon: Clock },
        ];

        const hodLinks = [
            { name: 'Department Analytics', path: '/hod/dashboard', icon: LayoutDashboard },
            { name: 'Faculty Insights', path: '/admin/users?role=teacher', icon: Users },
            { name: 'Reporting Suite', path: '/hod/reports', icon: History },
        ];

        const studentLinks = [
            { name: 'Scan QR', path: '/student/scan', icon: QrCode },
            { name: 'Attendance History', path: '/student/history', icon: History },
        ];

        let roleSpecific = [];
        if (user.role === 'admin') roleSpecific = adminLinks;
        if (user.role === 'hod') roleSpecific = hodLinks;
        if (user.role === 'teacher') roleSpecific = teacherLinks;
        if (user.role === 'student') roleSpecific = studentLinks;

        return {
            main: common,
            role: roleSpecific,
            account: [
                { name: 'My Profile', path: '/profile', icon: UserCircle },
            ]
        };
    };

    const sections = getLinks();

    const NavLink = ({ link }) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        
        return (
            <Link to={link.path}>
                <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                        isActive 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200/50' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}
                >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                    <span className="font-bold text-sm">{link.name}</span>
                    {isActive && (
                        <motion.div 
                            layoutId="activeSide"
                            className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <aside className="w-72 bg-slate-50/50 backdrop-blur-xl h-screen border-r border-slate-200/60 flex flex-col z-30">
            <div className="p-8">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200/50 group-hover:scale-110 transition-transform">
                        <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                        Gatekeeper<span className="text-primary-600">.</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto space-y-8 py-4">
                {/* Main Section */}
                <div>
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core</p>
                    <div className="space-y-1">
                        {sections.main.map((link) => <NavLink key={link.path} link={link} />)}
                    </div>
                </div>

                {/* Role Specific */}
                <div>
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        {user?.role} Management
                    </p>
                    <div className="space-y-1">
                        {sections.role.map((link) => <NavLink key={link.path} link={link} />)}
                    </div>
                </div>

                {/* Account */}
                <div>
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account</p>
                    <div className="space-y-1">
                        {sections.account.map((link) => <NavLink key={link.path} link={link} />)}
                    </div>
                </div>
            </nav>

            <div className="p-6 border-t border-slate-200/60">
                <div className="bg-white/50 rounded-[24px] p-4 border border-white mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                    <span className="font-bold text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
