import { useState } from 'react';
import { Mic, Send, Globe2, Bot } from 'lucide-react';
import axios from 'axios';
import { saveLocalQuestion } from '../../lib/pouchdb';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export default function Ask() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('Tamil');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const { isOnline, checkPending } = useOfflineSync();

  const tags = ['Math', 'Science', 'Computer Science', 'English', 'Career', 'Other'];
  const [selectedTag, setSelectedTag] = useState('Computer Science');

  const handleHold = () => {
    setIsRecording(true);
    setStatus('idle');
    setResult(null);
  };

  const submitQuestion = async (content) => {
    setStatus('translating');

    if (!isOnline) {
      // Offline mode
      await saveLocalQuestion({ text: content, sourceLang: lang, subject: selectedTag });
      checkPending();
      setResult({
        transcribedText: content,
        originalTranslated: 'Waiting for network sync...',
        aiReply: null,
        status: 'queued_locally'
      });
      setStatus('complete');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/ask', {
        text: content,
        sourceLang: lang,
        subject: selectedTag
      });
      setResult(res.data);
      setStatus('complete');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const handleRelease = async () => {
    setIsRecording(false);
    submitQuestion('audio-blob-simulation');
  };

  const handleSubmitText = async () => {
    if (!text) return;
    submitQuestion(text);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fadeUp">
      <h1 className="text-3xl font-syne font-bold mb-8 text-center">Ask Your Question</h1>

      <div className="card-glass p-8 space-y-8">
        {/* Language & Subject */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-teal font-bold mb-2">My Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none"
            >
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Swahili</option>
              <option>Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-teal font-bold mb-2">Subject</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none"
            >
              {tags.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Voice Input */}
        <div className="flex flex-col items-center justify-center py-8 border-y border-white/5 relative">
          <button
            onMouseDown={handleHold}
            onMouseUp={handleRelease}
            onTouchStart={handleHold}
            onTouchEnd={handleRelease}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording
                ? 'bg-coral text-white animate-breathe scale-110 shadow-[0_0_40px_rgba(255,107,107,0.6)]'
                : 'bg-teal text-ink hover:scale-105 shadow-lg'
              }`}
          >
            <Mic size={32} />
          </button>
          <p className="mt-4 text-sm font-bold text-paper/60">
            {isRecording ? "Recording... Release to send" : `Hold to record in ${lang}`}
          </p>
        </div>

        {/* Text Input Fallback */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-teal font-bold mb-2">Or type your question</label>
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 min-h-[100px] outline-none"
              placeholder={`Type in ${lang}...`}
            />
          </div>
          <button
            onClick={handleSubmitText}
            className="w-full mt-4 btn-primary flex justify-center items-center gap-2"
          >
            <Send size={18} /> Send to Mentor
          </button>
        </div>

        {/* Status & Preview Area */}
        {status === 'translating' && (
          <div className="p-6 bg-sky/10 border border-sky/20 rounded-xl flex items-center gap-4 animate-pulse">
            <Globe2 className="text-sky animate-spin" />
            <span className="text-sky font-bold">Translating & fetching AI response...</span>
          </div>
        )}

        {status === 'complete' && result && (
          <div className="space-y-4 animate-fadeUp">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xs text-sky mb-2 uppercase font-bold flex gap-2"><Globe2 size={14} /> Original ({lang})</div>
              <p>{result.transcribedText}</p>
            </div>

            <div className="p-4 bg-teal/5 rounded-xl border border-teal/20">
              <div className="text-xs text-teal mb-2 uppercase font-bold">🤖 Translated to English</div>
              <p>{result.originalTranslated}</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-sky/10 to-teal/10 rounded-xl border border-teal/30">
              <div className="text-sm text-lime mb-2 font-bold flex items-center gap-2">
                <Bot size={18} /> {result.status === 'queued_locally' ? 'Standby Mode' : 'Instance AI Tutor Reply'}
              </div>
              <p className="leading-relaxed">{result.aiReply || "You are offline. This question has been safely stored and will be automatically translated and sent to a mentor when you connect to a Village Hub or mobile network."}</p>
              <div className="mt-4 text-xs font-bold px-3 py-1 inline-block rounded-full border border-amber/30 text-amber bg-amber/10">
                {result.status === 'queued_locally' ? '📦 Queued for Sync' : 'Queued for Human Mentor Review'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
