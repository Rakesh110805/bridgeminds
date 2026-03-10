import { useState } from 'react';
import { PlayCircle, Mic, Send, Bot } from 'lucide-react';

export default function Chat() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      id: '1',
      sender: 'student',
      text: 'Python-ல் loops எப்படி?',
      translated: 'How do I use loops in Python?',
      time: '10:30 AM'
    },
    {
      id: '2',
      sender: 'ai',
      text: 'ஒரு loop என்பது வீட்டு வேலைகள் செய்வது போன்றது...',
      time: '10:31 AM'
    },
    {
      id: '3',
      sender: 'mentor',
      text: 'A loop is like doing chores. Let me explain...',
      translated: 'ஒரு loop என்பது வீட்டு வேலைகள் செய்வது போன்றது. நான் விளக்குகிறேன்...',
      isAudio: true,
      time: '11:45 AM'
    }
  ]);

  const speakText = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      // For demo, try to set to Tamil if possible, fallback to default
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('ta'));
      if (ptVoice) utterance.voice = ptVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS not supported in this browser.");
    }
  };

  const handleSend = () => {
    if (!text) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'student',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full bg-ink relative">
      <header className="px-8 py-5 border-b border-white/5 bg-ink3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet to-teal p-1">
            <div className="w-full h-full bg-ink rounded-full flex items-center justify-center font-bold text-lg text-white">
              A
            </div>
          </div>
          <div>
            <h2 className="font-syne font-bold text-xl">Dr. Amara Osei</h2>
            <p className="text-xs text-lime font-bold">Online • Replies within 2h</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map(msg => (
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
                    <p className="text-[15px] leading-relaxed">{msg.translated || msg.text}</p>
                    {msg.translated && (
                      <p className="text-xs mt-2 text-paper/40">Translated from English</p>
                    )}
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
      </div>

      <div className="p-4 border-t border-white/5 bg-ink3 flex gap-4 items-end">
        <button className="p-3 bg-teal/10 text-teal rounded-xl hover:bg-teal hover:text-ink transition-colors flex-shrink-0">
          <Mic size={24} />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-h-[50px] max-h-[150px] outline-none text-sm resize-none"
            placeholder="Type your message..."
          />
        </div>
        <button onClick={handleSend} className="p-3 bg-teal text-ink font-bold rounded-xl hover:bg-teal/80 transition-colors flex-shrink-0">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
