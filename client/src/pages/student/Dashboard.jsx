import { useAuth } from '../../components/AuthContext';
import { PlayCircle, Award, Target, MessageSquare } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 animate-fadeUp">
      <header>
        <h1 className="text-4xl font-syne font-bold text-white mb-2">Good morning, {user?.name?.split(' ')[0] || 'Priya'} 👋</h1>
        <p className="text-paper/60">Ready to break some walls today?</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card-glass p-6">
          <div className="flex gap-4 items-center mb-2 text-teal">
            <MessageSquare size={20} />
            <span className="text-xs uppercase tracking-wider font-bold">Questions</span>
          </div>
          <div className="text-4xl font-syne font-extrabold text-white">14</div>
        </div>
        
        <div className="card-glass p-6">
          <div className="flex gap-4 items-center mb-2 text-sky">
            <Target size={20} />
            <span className="text-xs uppercase tracking-wider font-bold">Packs Finished</span>
          </div>
          <div className="text-4xl font-syne font-extrabold text-white">3</div>
        </div>

        <div className="card-glass p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-[30px]" />
          <div className="flex gap-4 items-center mb-2 text-amber relative z-10">
            <Award size={20} />
            <span className="text-xs uppercase tracking-wider font-bold">Streak</span>
          </div>
          <div className="text-4xl font-syne font-extrabold text-white relative z-10">12 Days</div>
        </div>
      </div>

      {/* Recent from Mentor */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal mb-4">Recent from Mentor</h2>
        <div className="card-glass p-6 border-l-4 border-l-violet relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold mb-1">"A loop is like doing chores. Let me explain..."</p>
              <p className="text-paper/50 text-sm">Dr. Amara Osei • Computer Science</p>
            </div>
            <button className="w-12 h-12 rounded-full bg-violet/20 flex items-center justify-center text-violet hover:bg-violet hover:text-white transition-all transform hover:scale-105">
              <PlayCircle size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* My Learning Packs */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal">Your Learning Packs</h2>
          <span className="text-xs text-amber font-bold flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber"></div> Offline Ready
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="card-glass p-6 border border-amber/30">
            <h3 className="font-syne font-bold text-xl mb-1">Python Basics</h3>
            <p className="text-sm text-paper/60 mb-6">3 Lessons • 45MB</p>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-teal w-[100%] rounded-full"></div>
            </div>
          </div>
          
          <div className="card-glass p-6">
            <h3 className="font-syne font-bold text-xl mb-1">Algebra Foundations</h3>
            <p className="text-sm text-paper/60 mb-6">5 Lessons • 120MB</p>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-sky w-[30%] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
