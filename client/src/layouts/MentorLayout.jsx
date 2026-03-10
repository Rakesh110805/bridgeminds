import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Inbox, Users, UploadCloud, BarChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';

export default function MentorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = () => {
      api.get('/api/ask/pending')
        .then(r => setPendingCount(r.data.length))
        .catch(() => { });
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Inbox', icon: Inbox, path: '/mentor/dashboard', badge: pendingCount },
    { label: 'My Students', icon: Users, path: '/mentor/students' },
    { label: 'Upload Lessons', icon: UploadCloud, path: '/mentor/upload' },
    { label: 'Analytics', icon: BarChart, path: '/mentor/analytics' },
    { label: 'Settings', icon: Settings, path: '/mentor/settings' },
  ];

  return (
    <div className="flex bg-[#0D1321] min-h-screen text-paper font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-ink border-r border-white/5 flex flex-col justify-between py-6">
        <div>
          <div className="px-6 mb-8 mt-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-teal flex items-center justify-center font-syne font-bold text-ink">B</div>
            <div>
              <div className="font-syne font-bold text-sm tracking-wide">BridgeMinds</div>
              <div className="text-[10px] uppercase tracking-widest text-teal font-bold">Mentor Portal</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-4">
            {navItems.map(item => {
              const active = location.pathname === item.path || (item.path !== '/mentor/dashboard' && location.pathname.includes(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${active ? 'bg-teal/10 text-teal font-bold' : 'text-paper/60 hover:bg-white/5 hover:text-paper'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-teal text-ink' : 'bg-coral/20 text-coral'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-6 border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet to-teal flex items-center justify-center flex-shrink-0 font-bold text-white">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'Dr. Amara Osei'}</p>
              <p className="text-xs text-paper/50 truncate">{user?.email || 'amara@demo.com'}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 text-sm text-paper/50 hover:text-coral transition-colors w-full text-left">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="h-[60px] border-b border-white/5 px-8 flex justify-between items-center bg-[#0D1321] sticky top-0 z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-coral"></div>
            <div className="w-3 h-3 rounded-full bg-amber"></div>
            <div className="w-3 h-3 rounded-full bg-lime"></div>
          </div>
          <div className="text-xs font-bold tracking-widest text-paper/40 uppercase">Global Sync Status: Healthy</div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
