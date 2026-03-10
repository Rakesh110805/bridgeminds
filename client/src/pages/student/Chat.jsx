import { useState, useEffect, useRef } from 'react';
import { PlayCircle, Send, Bot, CheckCheck, Wifi } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../components/AuthContext';
import { useSocket } from '../../hooks/useSocket';

export default function Chat() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const bottomRef = useRef(null);

  useEffect(() => { fetchHistory(); }, [user]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit('join-room', user.id);
    socket.on('new-message', (msg) => {
      setMessages(prev => [...prev, { ...msg, rawTime: new Date() }]);
    });
    return () => { socket?.off('new-message'); };
  }, [socket, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const qs = await api.get(`/api/ask/student/${user.id}`);
      let chatFlow = [];
      for (const q of qs.data) {
        chatFlow.push({
          id: `q_${q.id}`, sender: 'student', text: q.original, translated: q.translated,
          time: new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawTime: new Date(q.createdAt), read: true
        });
        if (q.aiReply) {
          chatFlow.push({
            id: `ai_${q.id}`, sender: 'ai', text: q.aiReply.originalTranslated || q.aiReply.english,
            time: new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rawTime: new Date(q.createdAt)
          });
        }
        try {
          const reps = await api.get(`/api/mentor/question/${q.id}`);
          for (const rep of reps.data) {
            chatFlow.push({
              id: `rep_${rep.id}`, sender: 'mentor', text: rep.english, translated: rep.translated,
              mentorName: rep.mentorName || 'Your Mentor',
              time: new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              rawTime: new Date(rep.createdAt)
            });
          }
        } catch (e) { /* no replies yet */ }
      }
      chatFlow.sort((a, b) => a.rawTime - b.rawTime);
      setMessages(chatFlow);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ta-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const optimisticMsg = {
      id: `tmp_${Date.now()}`, sender: 'student', text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTime: new Date(), sending: true
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setText('');
    try {
      const res = await api.post('/api/ask', {
        text: text.trim(), sourceLang: 'Tamil', studentId: user?.id, subject: 'General'
      });
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id).concat([
        { ...optimisticMsg, id: `q_${res.data.questionId}`, sending: false },
        { id: `ai_${res.data.questionId}`, sender: 'ai', text: res.data.aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), rawTime: new Date() }
      ]));
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ink relative">
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 bg-ink3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet to-teal p-1">
            <div className="w-full h-full bg-ink rounded-full flex items-center justify-center font-bold text-lg text-white">S</div>
          </div>
          <div>
            <h2 className="font-syne font-bold text-xl">My Private Channel</h2>
            <p className="text-xs text-lime font-bold flex items-center gap-1">
              <Wifi size={10} /> {connected ? 'Live Connected' : 'Reconnecting...'}
            </p>
          </div>
        </div>
        <div className="text-xs bg-violet/10 text-violet border border-violet/30 px-3 py-1 rounded-full font-bold">
          Secure Global Sync
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-paper/50 animate-pulse">Decrypting communication logs...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl">💬</div>
            <p className="text-paper/50">No messages yet. Type a question below or go to the Ask tab to use voice!</p>
          </div>
        ) : messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'} animate-fadeUp`}>
            <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'student'
              ? 'bg-gradient-to-tr from-teal to-sky text-ink rounded-br-none'
              : msg.sender === 'ai'
                ? 'bg-transparent border border-sky border-l-4 rounded-bl-none'
                : 'bg-white/5 border border-violet/20 rounded-bl-none'
              } ${msg.sending ? 'opacity-60' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="text-xs font-bold text-sky mb-2 flex items-center gap-1"><Bot size={14} /> AI Tutor</div>
              )}
              {msg.sender === 'mentor' && (
                <div className="flex gap-3 items-start">
                  <button onClick={() => speakText(msg.translated || msg.text)} className="mt-1 text-violet hover:text-teal transition-colors flex-shrink-0">
                    <PlayCircle size={22} />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-violet mb-2">Human Mentor</div>
                    <p className="text-[15px] leading-relaxed">{msg.translated || msg.text}</p>
                  </div>
                </div>
              )}
              {msg.sender !== 'mentor' && (
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
              )}
              <div className={`text-[10px] mt-2 flex items-center gap-1 ${msg.sender === 'student' ? 'text-ink/60 justify-end' : 'text-paper/40'}`}>
                {msg.time}
                {msg.sender === 'student' && (
                  <CheckCheck size={12} className={msg.sending ? 'text-ink/30' : 'text-ink/60'} />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-ink3 flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={(e) => {
              const pastedText = e.clipboardData.getData('text');
              if (pastedText) {
                e.preventDefault();
                setText(prev => prev + pastedText);
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-h-[50px] max-h-[150px] outline-none text-sm resize-none focus:border-teal/50 transition-colors"
            placeholder="Type a question (or go to Ask tab for voice)..."
          />
        </div>
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="p-3 bg-gradient-to-r from-teal to-sky text-ink font-bold rounded-xl hover:opacity-90 transition flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
