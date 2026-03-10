import { useState, useEffect } from 'react';
import { PlayCircle, Mic, Send, Bot } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

export default function Chat() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const qs = await axios.get(`http://localhost:3001/api/ask/student/${user.id}`);

      // Transform SQLite structure into chronological chat message blocks
      let chatFlow = [];

      for (const q of qs.data) {
        // 1. Student's Original Question
        chatFlow.push({
          id: `q_${q.id}`,
          sender: 'student',
          text: q.original,
          translated: q.translated,
          time: new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawTime: new Date(q.createdAt)
        });

        // 2. AI Tutor Reply (if any)
        if (q.aiReply) {
          chatFlow.push({
            id: `ai_${q.id}`,
            sender: 'ai',
            text: q.aiReply.originalTranslated,
            time: new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rawTime: new Date(q.createdAt)
          });
        }

        // 3. Mentor Replies (if any)
        try {
          const reps = await axios.get(`http://localhost:3001/api/mentor/question/${q.id}`);
          for (const rep of reps.data) {
            chatFlow.push({
              id: `rep_${rep.id}`,
              sender: 'mentor',
              text: rep.english,
              translated: rep.translated,
              time: new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              rawTime: new Date(rep.createdAt)
            });
          }
        } catch (e) {
          console.error('Failed to fetch replies for ', q.id);
        }
      }

      // Sort by absolute time to ensure correct flow
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
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('ta'));
      if (ptVoice) utterance.voice = ptVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS not supported in this browser.");
    }
  };

  const handleSend = () => {
    // Basic redirect suggestion for demo flow
    alert("Please use the 'Ask' tab to record new questions with Voice Translation.");
    setText('');
  };

  return (
    <div className="flex flex-col h-full bg-ink relative">
      <header className="px-8 py-5 border-b border-white/5 bg-ink3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet to-teal p-1">
            <div className="w-full h-full bg-ink rounded-full flex items-center justify-center font-bold text-lg text-white">
              S
            </div>
          </div>
          <div>
            <h2 className="font-syne font-bold text-xl">My Private Channel</h2>
            <p className="text-xs text-lime font-bold">Secure Global Sync</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-paper/50 animate-pulse">
            Decrypting communication logs...
          </div>
        ) : messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'student'
              ? 'bg-gradient-to-tr from-teal to-sky text-ink rounded-br-none'
              : msg.sender === 'ai'
                ? 'bg-transparent border border-sky border-l-4 rounded-bl-none'
                : 'bg-white/5 border border-white/10 rounded-bl-none'
              }`}>

              {msg.sender === 'ai' && (
                <div className="text-xs font-bold text-sky mb-2 flex items-center gap-1">
                  <Bot size={14} /> AI Tutor
                </div>
              )}

              {msg.sender === 'mentor' && (
                <div className="flex gap-4 items-start">
                  <button onClick={() => speakText(msg.translated || msg.text)} className="mt-1 text-violet hover:text-teal transition-colors">
                    <PlayCircle size={24} />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-violet mb-2 flex items-center gap-1">Human Mentor</div>
                    <p className="text-[15px] leading-relaxed">{msg.translated || msg.text}</p>
                  </div>
                </div>
              )}

              {msg.sender !== 'mentor' && (
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
              )}

              <div className={`text-[10px] mt-2 ${msg.sender === 'student' ? 'text-ink/60 text-right' : 'text-paper/40'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {!loading && messages.length === 0 && (
          <div className="text-center py-20 text-paper/50">
            <p>No questions yet. Go to the Ask tab to start!</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-ink3 flex gap-4 items-end">
        <button className="p-3 bg-teal/10 text-teal rounded-xl hover:bg-teal hover:text-ink transition-colors flex-shrink-0 cursor-not-allowed opacity-50">
          <Mic size={24} />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-h-[50px] max-h-[150px] outline-none text-sm resize-none"
            placeholder="Go to 'Ask' tab to record new multilingual questions..."
            disabled
          />
        </div>
        <button onClick={handleSend} className="p-3 bg-teal/50 text-ink font-bold rounded-xl cursor-not-allowed flex-shrink-0">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
