import { useAuth } from '../context/AuthContext';
import { Search, Sparkles, Command } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-white px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative group w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Command className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search system queries..." 
                        className="block w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-[18px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder-slate-400/80 shadow-sm"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <NotificationPanel />

                <div className="hidden md:flex items-center gap-4 bg-white/80 border border-white p-1.5 pr-4 rounded-[22px] shadow-sm">
                    <div className="w-9 h-9 bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-white text-xs shadow-lg shadow-slate-900/10">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 tracking-tight leading-none mb-0.5">{user?.name}</span>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-2.5 h-2.5 text-primary-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

