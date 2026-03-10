import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircleQuestion, Package, Bot, BarChart2, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useOfflineSync } from '../hooks/useOfflineSync';

export default function StudentLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const { isOnline, pendingSync } = useOfflineSync();

  const navItems = [
    { label: 'Home', icon: Home, path: '/student/dashboard' },
    { label: 'Ask Mentor', icon: MessageCircleQuestion, path: '/student/ask' },
    { label: 'My Packs', icon: Package, path: '/student/packs' },
  ];

  return (
    <div className="flex bg-ink min-h-screen text-paper">
      {/* Sidebar */}
      <aside className="w-[220px] bg-ink3 flex flex-col justify-between py-6 border-r border-white/5">
        <div>
          <div className="px-6 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal to-sky" />
            <span className="font-syne font-bold tracking-wide">BridgeMinds</span>
          </div>

          <nav className="flex flex-col gap-2 px-3">
            {navItems.map(item => {
              const active = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-teal/10 text-teal font-bold' : 'text-paper/70 hover:bg-white/5 hover:text-paper'
                    }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-6">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 text-sm">
              {isOnline ? <Wifi size={18} className="text-lime" /> : <WifiOff size={18} className="text-coral" />}
              <span className={isOnline ? 'text-lime font-bold' : 'text-coral font-bold'}>
                {isOnline ? 'Online Sync' : 'Offline Mode'}
              </span>
            </div>
            {!isOnline && pendingSync > 0 && (
              <div className="text-xs text-amber font-bold bg-amber/10 px-3 py-2 rounded-lg border border-amber/20">
                📦 {pendingSync} pending in queue
              </div>
            )}
          </div>

          <button onClick={logout} className="flex items-center gap-3 text-paper/60 hover:text-coral transition-colors w-full text-left">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
