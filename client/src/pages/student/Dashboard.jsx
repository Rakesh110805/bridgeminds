import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { PlayCircle, Award, Target, MessageSquare, Globe2, Bot, Zap, Volume2 } from 'lucide-react';
import axios from 'axios';

function AnimatedCounter({ target, duration = 1200, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}{suffix}</span>;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const speakText = (text, lang = 'Tamil') => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const LANG_BCP47 = {
      'Tamil': 'ta-IN', 'Hindi': 'hi-IN', 'English': 'en-US', 'French': 'fr-FR',
      'Spanish': 'es-ES', 'Telugu': 'te-IN', 'Kannada': 'kn-IN', 'Bengali': 'bn-IN',
      'Arabic': 'ar-SA', 'Swahili': 'sw-KE', 'Marathi': 'mr-IN', 'Punjabi': 'pa-IN'
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_BCP47[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Try to find a native voice for the language
    const voices = window.speechSynthesis.getVoices();
    const nativeVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (nativeVoice) utterance.voice = nativeVoice;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/student/dashboard/${user?.id}`)
      .then(res => setStats(res.data))
      .catch(console.error);
  }, [user]);

  if (!stats) return (
    <div className="p-10">
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => <div key={i} className="card-glass p-6 h-28 animate-pulse bg-white/5 rounded-2xl" />)}
      </div>
      <div className="card-glass p-6 h-32 animate-pulse bg-white/5 rounded-2xl mb-6" />
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <div key={i} className="card-glass p-6 h-36 animate-pulse bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  );

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const statCards = [
    { label: 'Questions', icon: MessageSquare, value: stats.questionsCount, color: 'teal', from: 'from-teal/20', border: 'border-teal/30', shadow: 'shadow-[0_0_15px_rgba(0,201,167,0.15)]' },
    { label: 'Packs Done', icon: Target, value: stats.packsFinished, color: 'sky', from: 'from-sky/20', border: 'border-sky/30', shadow: 'shadow-[0_0_15px_rgba(76,201,240,0.15)]' },
    { label: 'Languages', icon: Globe2, value: stats.languagesBridged, color: 'violet', from: 'from-violet/20', border: 'border-violet/30', shadow: 'shadow-[0_0_15px_rgba(123,47,190,0.15)]' },
    { label: 'Day Streak 🔥', icon: Award, value: stats.streak, color: 'amber', from: 'from-amber/25', border: 'border-amber/40', shadow: 'shadow-[0_0_20px_rgba(255,184,48,0.25)]', isStreak: true },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 animate-fadeUp">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-syne font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal via-sky to-violet mb-2">
          {greeting}, {user?.name?.split(' ')[0] || 'Priya'} 👋
        </h1>
        <p className="text-paper/60">Ready to break some walls today?</p>
      </header>

      {/* Stats Row - 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, icon: Icon, value, color, from, border, shadow, isStreak }) => (
          <div key={label} className={`card-glass p-5 relative overflow-hidden bg-gradient-to-br ${from} to-transparent ${border} border ${shadow} hover:scale-105 transition-all duration-300 group cursor-default`}>
            {isStreak && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            )}
            <div className={`flex gap-3 items-center mb-2 text-${color} relative z-10`}>
              <Icon size={18} className={isStreak ? 'animate-pulse' : ''} />
              <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
            </div>
            <div className={`text-4xl font-syne font-extrabold text-white relative z-10 ${isStreak ? 'drop-shadow-[0_2px_8px_rgba(255,184,48,0.5)]' : ''}`}>
              <AnimatedCounter target={value} />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Heatmap */}
      <div className="card-glass p-6">
        <h2 className="text-xs uppercase tracking-widest text-teal font-bold mb-4">This Week's Activity</h2>
        <div className="flex gap-2">
          {stats.last7Days.map(day => (
            <div key={day.date} className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${day.active
              ? 'bg-gradient-to-b from-teal/50 to-teal/20 border border-teal/40 shadow-[0_0_10px_rgba(0,201,167,0.2)]'
              : 'bg-white/5 border border-white/5'
              }`}>
              <div className={`w-2 h-2 rounded-full ${day.active ? 'bg-teal' : 'bg-white/20'}`} />
              <span className={`text-[10px] font-bold ${day.active ? 'text-teal' : 'text-paper/20'}`}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent from Mentor */}
      <section className="animate-fadeUp">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal mb-4">Recent from Mentor</h2>
        {stats.recentReply ? (
          <div className="card-glass p-6 border-l-4 border-l-violet relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold mb-1">"{stats.recentReply.translated || stats.recentReply.english}"</p>
                <p className="text-paper/50 text-sm">{stats.recentReply.mentorName} • {stats.recentReply.subject}</p>
              </div>
              <button
                onClick={() => {
                  const text = stats.recentReply.translated || stats.recentReply.english;
                  const lang = stats.recentReply.sourceLang || 'Tamil';
                  speakText(text, lang);
                }}
                title={speaking ? 'Click to stop' : 'Listen to reply'}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 flex-shrink-0 ${speaking
                  ? 'bg-violet text-white animate-pulse shadow-[0_0_20px_rgba(123,47,190,0.6)]'
                  : 'bg-violet/20 text-violet hover:bg-violet hover:text-white'
                  }`}>
                {speaking ? <Volume2 size={22} /> : <PlayCircle size={24} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="card-glass p-6 text-paper/50 text-sm flex items-center gap-3">
            <MessageSquare size={20} className="text-teal/50" />
            No recent replies from your mentors yet. Keep asking questions!
          </div>
        )}
      </section>

      {/* My Learning Packs */}
      <section className="animate-fadeUp">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal">Your Recent Packs</h2>
          <span className="text-xs text-amber font-bold flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div> Offline Ready
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.recentPacks.map(pack => (
            <div key={pack.id} className={`card-glass p-5 hover:scale-[1.02] transition-all duration-300 group ${pack.downloaded ? 'border border-amber/30' : ''}`}>
              <div className="flex justify-between mb-1">
                <h3 className="font-syne font-bold text-lg group-hover:text-teal transition-colors">{pack.title}</h3>
                {pack.downloaded && <div className="text-xs text-amber font-bold">Offline</div>}
              </div>
              <p className="text-xs text-paper/50 mb-4">{pack.lessons} Lessons • {pack.size}</p>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal to-sky transition-all duration-1000" style={{ width: `${pack.progress}%` }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-paper/30">{pack.subject}</span>
                <span className="text-[10px] text-teal font-bold">{pack.progress}%</span>
              </div>
            </div>
          ))}
          {stats.recentPacks.length === 0 && (
            <div className="col-span-2 card-glass p-6 text-paper/50 text-sm text-center">No learning packs assigned yet.</div>
          )}
        </div>
      </section>

      {/* AI Suggested Next Steps */}
      <section className="animate-fadeUp">
        <div className="card-glass p-6 border border-violet/20 bg-gradient-to-br from-violet/5 to-transparent">
          <div className="flex items-center gap-2 mb-4 text-violet text-xs font-bold uppercase tracking-widest">
            <Bot size={14} /> AI Recommends
          </div>
          <ul className="space-y-2 text-sm text-paper/80">
            {stats.recentPacks[0] && stats.recentPacks[0].progress < 100 && (
              <li className="flex items-center gap-2"><Zap size={12} className="text-amber" /> Complete "{stats.recentPacks[0].title}" ({stats.recentPacks[0].progress}% done)</li>
            )}
            <li className="flex items-center gap-2"><Zap size={12} className="text-amber" /> Ask your mentor about your recent questions</li>
            {stats.streak > 0 && (
              <li className="flex items-center gap-2"><Zap size={12} className="text-amber" /> You're on a {stats.streak}-day streak! Keep going 🔥</li>
            )}
            {stats.streak === 0 && (
              <li className="flex items-center gap-2"><Zap size={12} className="text-amber" /> Start your learning streak by asking a question today!</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
