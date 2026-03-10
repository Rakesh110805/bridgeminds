import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { PlayCircle, Award, Target, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/student/dashboard/${user?.id || 'demo-123'}`)
      .then(res => setStats(res.data))
      .catch(console.error);
  }, [user]);

  if (!stats) return <div className="p-10 text-center animate-pulse text-paper/50">Loading your profile...</div>;

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 animate-fadeUp">
      <header>
        <h1 className="text-4xl font-syne font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal to-sky mb-2">{greeting}, {user?.name?.split(' ')[0] || 'Priya'} 👋</h1>
        <p className="text-paper/60">Ready to break some walls today?</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card-glass p-6 bg-gradient-to-br from-white/5 to-teal/10 hover:scale-105 transition-transform duration-300 border border-teal/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
          <div className="flex gap-4 items-center mb-2 text-teal">
            <MessageSquare size={20} />
            <span className="text-xs uppercase tracking-wider font-bold">Questions</span>
          </div>
          <div className="text-4xl font-syne font-extrabold text-white">{stats.questionsCount}</div>
        </div>

        <div className="card-glass p-6 bg-gradient-to-br from-white/5 to-sky/10 hover:scale-105 transition-transform duration-300 border border-sky/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          <div className="flex gap-4 items-center mb-2 text-sky">
            <Target size={20} />
            <span className="text-xs uppercase tracking-wider font-bold">Packs Finished</span>
          </div>
          <div className="text-4xl font-syne font-extrabold text-white">{stats.packsFinished}</div>
        </div>

        <div className="card-glass p-6 relative overflow-hidden bg-gradient-to-br from-amber/20 to-coral/10 hover:scale-105 transition-transform duration-300 border border-amber/30 shadow-[0_0_20px_rgba(251,191,36,0.2)] group hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber/20 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-500" />
          <div className="flex gap-4 items-center mb-2 text-amber relative z-10">
            <Award size={20} className="animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold">Streak</span>
          </div>
          <div className="text-5xl font-syne font-extrabold text-white relative z-10 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">{stats.streak} <span className="text-xl font-normal text-white/80">Days</span></div>
        </div>
      </div>

      {/* Recent from Mentor */}
      <section className="animate-fadeUp" style={{ animationDelay: '100ms' }}>
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal mb-4">Recent from Mentor</h2>
        {stats.recentReply ? (
          <div className="card-glass p-6 border-l-4 border-l-violet relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold mb-1">"{stats.recentReply.translated}"</p>
                <p className="text-paper/50 text-sm">{stats.recentReply.mentorName} • {stats.recentReply.subject}</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-violet/20 flex items-center justify-center text-violet hover:bg-violet hover:text-white transition-all transform hover:scale-105">
                <PlayCircle size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card-glass p-6 text-paper/50 text-sm">No recent replies from your mentors yet. Keep asking questions!</div>
        )}
      </section>

      {/* My Learning Packs */}
      <section className="animate-fadeUp" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal">Your Recent Packs</h2>
          <span className="text-xs text-amber font-bold flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber"></div> Offline Ready
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {stats.recentPacks.map(pack => (
            <div key={pack.id} className={`card-glass p-6 hover:bg-white/5 transition-all hover:scale-[1.02] duration-300 group ${pack.downloaded ? 'border border-amber/30' : ''}`}>
              <div className="flex justify-between mb-1">
                <h3 className="font-syne font-bold text-xl group-hover:text-teal transition-colors">{pack.title}</h3>
                {pack.downloaded && <div className="text-xs text-amber font-bold flex items-center">Offline</div>}
              </div>
              <p className="text-sm text-paper/60 mb-6">{pack.lessons} Lessons • {pack.size}</p>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-teal transition-all" style={{ width: `${pack.progress}%` }}></div>
              </div>
            </div>
          ))}
          {stats.recentPacks.length === 0 && (
            <div className="col-span-2 card-glass p-6 text-paper/50 text-sm">No learning packs assigned yet.</div>
          )}
        </div>
      </section>

    </div>
  );
}
