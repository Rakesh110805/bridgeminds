import { useState, useEffect, useCallback } from 'react';
import { Globe2, MessageSquare, Reply, Send, X, Clock, AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';
import api, { BASE_URL } from '../../lib/api';
import { useAuth } from '../../components/AuthContext';
import { translateFromEnglish } from '../../lib/translate';

function getPriority(createdAt) {
  const hours = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  if (hours > 24) return { label: '🔴 High', color: 'text-coral', bg: 'bg-coral/10 border-coral/30' };
  if (hours > 6) return { label: '🟡 Medium', color: 'text-amber', bg: 'bg-amber/10 border-amber/30' };
  return { label: '🟢 New', color: 'text-lime', bg: 'bg-lime/10 border-lime/30' };
}

function TranslationPreview({ text, targetLang }) {
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text || text.length < 5) { setPreview(''); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Use browser-side translation (no API key needed)
        const translated = await translateFromEnglish(text, targetLang);
        setPreview(translated || '');
      } catch { setPreview(''); }
      finally { setLoading(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [text, targetLang]);

  if (!preview && !loading) return null;
  return (
    <div className="mt-3 p-4 bg-teal/5 border border-teal/20 rounded-xl animate-fadeUp">
      <div className="text-xs font-bold text-teal flex items-center gap-2 mb-2">
        <Globe2 size={12} />
        {loading ? 'Translating live...' : `Preview in ${targetLang}:`}
      </div>
      <p className="text-sm text-paper/80 leading-relaxed italic">
        {loading ? <span className="animate-pulse">● ● ●</span> : preview}
      </p>
    </div>
  );
}

export default function MentorDashboard() {
  const [replyText, setReplyText] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const [stats, setStats] = useState({ activeStudents: 0, pendingQuestions: 0, impactScore: 0 });
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/api/mentor/stats/${user?.id}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/api/ask/pending');
      setQuestions(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReply = async (q) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      // Translate in browser before sending to server
      let translatedReply = replyText;
      if (q.sourceLang && q.sourceLang !== 'English') {
        translatedReply = await translateFromEnglish(replyText, q.sourceLang);
      }

      await api.post('/api/mentor/reply', {
        mentorReply: replyText,
        translatedReply, // pre-translated in browser
        questionId: q.id,
        mentorId: user?.id
      });
      setSent({ translated: translatedReply, lang: q.sourceLang });
      setQuestions(qs => qs.filter(item => item.id !== q.id));
      setReplyText('');
      fetchStats();
      setTimeout(() => { setActiveModal(null); setSent(null); }, 2500);
    } catch (e) {
      console.error(e);
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const filtered = questions.filter(q => {
    if (filter === 'All') return true;
    const hours = (Date.now() - new Date(q.createdAt).getTime()) / 3600000;
    if (filter === 'High') return hours > 24;
    if (filter === 'Medium') return hours > 6 && hours <= 24;
    if (filter === 'New') return hours <= 6;
    return q.subject === filter;
  });

  const subjects = ['All', 'New', 'Medium', 'High', ...new Set(questions.map(q => q.subject))];

  return (
    <div className="space-y-8 animate-fadeUp">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-syne font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-violet to-sky">
          Mentor Inbox
        </h1>
        <p className="text-paper/60">{questions.length} multilingual questions waiting from students across the globe.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Active Students', value: stats.activeStudents, color: 'teal' },
          { label: 'Pending Questions', value: stats.pendingQuestions, color: 'amber' },
          { label: 'Impact Score', value: stats.impactScore, color: 'sky' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card-glass p-6 border-t-2 border-t-${color}/50 hover:scale-[1.02] transition-transform`}>
            <div className="text-xs uppercase tracking-wider text-paper/50 font-bold mb-2">{label}</div>
            <div className={`text-4xl font-syne font-bold text-${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === s ? 'bg-violet/20 text-violet border-violet/40' : 'bg-white/5 text-paper/50 border-white/10 hover:border-white/30'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-paper/40 animate-pulse">Loading incoming questions...</div>
        ) : filtered.length === 0 ? (
          <div className="card-glass p-12 text-center space-y-3">
            <CheckCircle2 size={44} className="mx-auto text-teal/30" />
            <p className="text-paper/50">All caught up — amazing work! 🎉</p>
          </div>
        ) : filtered.map(q => {
          const priority = getPriority(q.createdAt);
          let aiReply = null;
          try { aiReply = q.aiReply ? JSON.parse(q.aiReply) : null; } catch { }
          const timeStr = new Intl.DateTimeFormat('en', { timeStyle: 'short', dateStyle: 'short' }).format(new Date(q.createdAt));

          return (
            <div key={q.id} className="card-glass p-6 hover:bg-white/5 transition-colors group border border-white/5 hover:border-violet/20">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky to-teal flex items-center justify-center font-bold text-ink text-lg flex-shrink-0">
                  {(q.studentName || 'S').charAt(0)}
                </div>

                <div className="flex-1">
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-base">{q.studentName || 'Student'} <span className="text-paper/40 text-sm font-normal">• {q.subject}</span></h3>
                      <p className="text-xs text-paper/40 flex items-center gap-1 mt-0.5"><Clock size={10} />{timeStr}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${priority.bg}`}>{priority.label}</span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal/10 text-teal border border-teal/20 flex items-center gap-1">
                        <Globe2 size={10} /> {q.sourceLang}
                      </span>
                    </div>
                  </div>

                  {/* Translation Display - The Core Feature */}
                  <div className="space-y-3 mb-4">
                    {/* Original in native language */}
                    <div className="p-3 rounded-xl bg-violet/5 border border-violet/15">
                      <div className="text-[10px] font-bold text-violet uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Globe2 size={10} /> Original in {q.sourceLang}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-paper/70 italic">"{q.original}"</p>
                        <button onClick={() => speakText(q.original)} className="text-violet hover:text-teal transition-colors flex-shrink-0">
                          <PlayCircle size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Translated to English */}
                    <div className="p-3 rounded-xl bg-sky/5 border border-sky/15">
                      <div className="text-[10px] font-bold text-sky uppercase tracking-widest mb-1">→ Translated to English</div>
                      <p className="text-sm text-paper">{q.translated}</p>
                    </div>

                    {/* AI Pre-answer */}
                    {aiReply && (
                      <div className="p-3 rounded-xl bg-teal/5 border border-teal/15">
                        <div className="text-[10px] font-bold text-teal uppercase tracking-widest mb-1">🤖 AI Pre-Answer (for your reference)</div>
                        <p className="text-sm text-paper/70">{aiReply.english}</p>
                      </div>
                    )}

                    {/* Audio recording */}
                    {q.audioPath && (
                      <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-[10px] font-bold text-amber mb-2 uppercase tracking-wider">🎙 Student Voice Recording</p>
                        <audio controls className="w-full h-8 outline-none" src={`${BASE_URL}${q.audioPath}`} />
                      </div>
                    )}
                  </div>

                  <button onClick={() => { setActiveModal(q); setReplyText(''); }}
                    className="btn-outline text-sm py-2 px-5 flex items-center gap-2 hover:bg-violet/10 hover:border-violet/50 hover:text-violet transition-all">
                    <Reply size={15} /> Reply in English → Auto-translated to {q.sourceLang}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Modal with Live Translation Preview */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/95 backdrop-blur-sm animate-fadeUp">
          <div className="card-glass w-full max-w-2xl bg-[#0f111a] border border-white/10 p-8 shadow-2xl">
            {sent ? (
              /* Success State */
              <div className="text-center space-y-4 py-6 animate-fadeUp">
                <CheckCircle2 size={52} className="mx-auto text-teal" />
                <h3 className="text-xl font-syne font-bold">Reply Sent! 🌍</h3>
                <p className="text-paper/60 text-sm">Your reply was translated and delivered to the student in <span className="text-teal font-bold">{sent.lang}</span>:</p>
                <div className="p-4 bg-teal/5 border border-teal/20 rounded-xl text-left">
                  <p className="text-sm italic text-paper/80">"{sent.translated}"</p>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-syne font-bold mb-1">Reply to Student</h3>
                    <p className="text-xs text-paper/50">Your English reply will be <span className="text-teal font-bold">auto-translated to {activeModal.sourceLang}</span> before delivery</p>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="text-paper/40 hover:text-paper transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Student's question context */}
                <div className="mb-5 space-y-2">
                  <div className="p-3 rounded-xl bg-violet/5 border border-violet/15">
                    <div className="text-[10px] font-bold text-violet mb-1">STUDENT ASKED (in {activeModal.sourceLang})</div>
                    <p className="text-xs text-paper/60 italic">"{activeModal.original}"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-sky/5 border border-sky/15">
                    <div className="text-[10px] font-bold text-sky mb-1">IN ENGLISH</div>
                    <p className="text-sm text-paper">{activeModal.translated}</p>
                  </div>
                </div>

                {/* Mentor Reply Input */}
                <div className="relative">
                  <textarea
                    autoFocus
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    maxLength={500}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[140px] outline-none text-sm focus:border-teal/50 transition-colors resize-none"
                    placeholder={`Type your expert reply in English... It will be auto-translated to ${activeModal.sourceLang}`}
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-paper/30">{replyText.length}/500</div>
                </div>

                {/* Live Translation Preview */}
                <TranslationPreview text={replyText} targetLang={activeModal.sourceLang} />

                {/* Actions */}
                <div className="flex justify-between items-center mt-5">
                  <p className="text-xs text-paper/40 flex items-center gap-1">
                    <Globe2 size={12} className="text-teal" />
                    Real-time translation via Google Translate
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveModal(null)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
                    <button onClick={() => handleReply(activeModal)} disabled={sending || !replyText.trim()}
                      className="btn-primary py-2 px-5 text-sm flex gap-2 items-center disabled:opacity-40">
                      {sending ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" /> : <><Send size={15} /> Send in {activeModal.sourceLang}</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
