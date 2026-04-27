import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  Boxes,
  FolderKanban,
  LibraryBig,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo, { Mark } from '../components/Logo';
import { product, reviewQueue } from '../data/siteData';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Workspace', to: '/workspace', icon: Boxes },
  { label: 'Prompt Library', to: '/workspace/library', icon: LibraryBig },
  { label: 'Projects', to: '/workspace/projects', icon: FolderKanban },
  { label: 'Settings', to: '/workspace/settings', icon: Settings },
];

const MotionAside = motion.aside;

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
    isActive ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
  }`;

const SidebarContent = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo to="/workspace" />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/workspace'} className={navClass} onClick={onNavigate}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 p-4">
        <div className="mb-4 rounded-lg border border-ink/10 bg-paper p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">Review queue</p>
          <div className="mt-3 space-y-2">
            {reviewQueue.slice(0, 2).map((item) => (
              <div key={item.item} className="flex items-center gap-2 text-xs font-bold text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                <span className="truncate">{item.item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-black text-white">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-ink">{user?.name}</p>
            <p className="truncate text-xs font-bold text-ink/50">{user?.role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-ink/60 transition hover:bg-coral/10 hover:text-coral"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};

const WorkspaceLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink/10 bg-white lg:block">
        <SidebarContent />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          />
          <MotionAside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="relative h-full w-[86vw] max-w-80 border-r border-ink/10 bg-white shadow-crisp"
          >
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md border border-ink/10 p-2 text-ink"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </MotionAside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-md border border-ink/10 bg-white p-2 text-ink lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden items-center gap-3 sm:flex lg:hidden">
                <Mark />
                <span className="text-sm font-black">{product.name}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/50">{product.college}</p>
                <p className="text-sm font-bold text-ink/70">Workspace command center</p>
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <label className="relative w-full max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  type="search"
                  placeholder="Search briefs, prompts, projects"
                  className="h-10 w-full rounded-lg border border-ink/10 bg-white pl-10 pr-4 text-sm font-semibold text-ink outline-none transition placeholder:text-ink/40 focus:border-teal focus:ring-4 focus:ring-teal/10"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-ink/10 bg-white p-2.5 text-ink transition hover:border-ink"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 sm:flex">
                <Sparkles className="h-4 w-4 text-teal" />
                <span className="text-xs font-black text-ink">{user?.team}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
