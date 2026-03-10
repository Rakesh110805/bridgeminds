import { useState, useEffect } from 'react';
import { Globe2, MessageSquare, Reply, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

export default function MentorDashboard() {
  const [replyText, setReplyText] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeStudents: 0, pendingQuestions: 0, impactScore: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/mentor/stats/${user?.id || 'mentor-demo'}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/ask/pending');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch pending questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (q) => {
    if (!replyText) return;
    try {
      await axios.post('http://localhost:3001/api/mentor/reply', {
        mentorReply: replyText,
        questionId: q.id,
        mentorId: user?.id || 'mentor-demo'
      });
      // Remove question from list since it's answered
      setQuestions(questions.filter(item => item.id !== q.id));
      setActiveModal(null);
      setReplyText('');
    } catch (e) {
      console.error(e);
      alert('Failed to send reply');
    }
  };

  return (
    <div className="space-y-8 animate-fadeUp">
      <div>
        <h1 className="text-3xl font-syne font-bold mb-2">Mentor Inbox</h1>
        <p className="text-paper/60">You have {questions.length} questions waiting across the globe.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card-glass p-6 border-t border-t-teal/50">
          <div className="text-sm text-paper/60 font-bold mb-1">Active Students</div>
          <div className="text-4xl font-syne font-bold text-teal">{stats.activeStudents}</div>
        </div>
        <div className="card-glass p-6 border-t border-t-amber/50">
          <div className="text-sm text-paper/60 font-bold mb-1">Pending Questions</div>
          <div className="text-4xl font-syne font-bold text-amber">{stats.pendingQuestions}</div>
        </div>
        <div className="card-glass p-6 border-t border-t-sky/50">
          <div className="text-sm text-paper/60 font-bold mb-1">Impact Score</div>
          <div className="text-4xl font-syne font-bold text-sky">{stats.impactScore}</div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-paper/50 animate-pulse">
            Fetching secure questions...
          </div>
        ) : questions.map(q => {
          // Calculate human readable time difference
          const time = new Date(q.createdAt);
          const now = new Date();
          const p = new Intl.DateTimeFormat('en', { timeStyle: 'short' }).format(time);

          return (
            <div key={q.id} className="card-glass p-6 relative flex gap-6 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky to-teal flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{q.studentId === 'demo-123' ? 'Demo Student' : q.studentId} <span className="text-paper/40 text-sm font-normal">• {q.subject}</span></h3>
                    <div className="text-xs text-paper/50 flex items-center gap-2 mt-1">
                      Received {p} via Secure Sync
                    </div>
                  </div>
                  <div className="text-xs flex items-center gap-1 text-teal font-bold px-3 py-1 bg-teal/10 rounded-full border border-teal/20">
                    <Globe2 size={12} /> Translated from {q.sourceLang}
                  </div>
                </div>

                <div className="my-4 space-y-2">
                  <p className="text-lg leading-relaxed">{q.translated}</p>
                  <p className="text-xs text-paper/40 italic">Original: "{q.original}"</p>

                  {q.audioPath && (
                    <div className="mt-4 p-3 bg-black/20 rounded-xl border border-white/5 flex flex-col gap-2">
                      <span className="text-xs font-bold text-teal flex items-center gap-1">Student's Original Recording</span>
                      <audio controls className="w-full h-10 outline-none" src={`http://localhost:3001${q.audioPath}`} />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveModal(q)}
                  className="btn-outline text-sm py-2 px-4 flex items-center gap-2 mt-4"
                >
                  <Reply size={16} /> Reply to Student
                </button>
              </div>
            </div>
          )
        })}

        {!loading && questions.length === 0 && (
          <div className="text-center py-20 text-paper/50">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>You're all caught up! Great job.</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm animate-fadeUp">
          <div className="card-glass w-full max-w-2xl bg-[#111827] border-white/10 p-8">
            <div className="mb-6 pb-6 border-b border-white/5">
              <h3 className="text-xl font-syne font-bold mb-2">Replying to Question</h3>
              <p className="text-sm p-4 bg-white/5 rounded-xl border border-white/5 border-l-4 border-l-teal">
                "{activeModal.translated}"
              </p>
            </div>

            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[150px] outline-none mb-6 text-sm"
              placeholder={`Type your reply in English. It will be auto-translated to ${activeModal.sourceLang} before delivery...`}
            />

            <div className="flex justify-between items-center">
              <p className="text-xs text-teal flex items-center gap-1 font-bold">
                <Globe2 size={14} /> AI will translate to {activeModal.sourceLang}
              </p>
              <div className="flex gap-4">
                <button onClick={() => setActiveModal(null)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
                <button onClick={() => handleReply(activeModal)} className="btn-primary py-2 px-5 text-sm flex gap-2 items-center">
                  <Send size={16} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
