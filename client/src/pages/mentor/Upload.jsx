import { useState, useRef } from 'react';
import { UploadCloud, FileVideo, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function MentorUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, complete
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('subject', subject);

      await axios.post('http://localhost:3001/api/packs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Upload failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fadeUp">
      <h1 className="text-3xl font-syne font-bold mb-2">Upload Lesson Pack</h1>
      <p className="text-paper/60 mb-8">Share videos. AI will automatically transcribe and subtitle them into 70+ languages.</p>

      {status === 'complete' ? (
        <div className="card-glass p-12 text-center border-teal/30">
          <div className="w-20 h-20 rounded-full bg-teal/20 text-teal flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-paper/60 mb-8">Your pack "{file?.name}" is being processed for offline sync and AI translation.</p>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">
            Upload Another Pack
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            className={`card-glass p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all ${dragActive ? 'border-teal bg-teal/5' : file ? 'border-sky bg-sky/5' : 'border-white/20'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="text-center">
                <FileVideo size={48} className="text-sky mx-auto mb-4" />
                <p className="font-bold text-lg mb-1">{file.name}</p>
                <p className="text-sm text-paper/50">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button onClick={() => setFile(null)} className="text-coral text-sm mt-4 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="text-center pointer-events-none">
                <UploadCloud size={48} className="text-teal mx-auto mb-4 opacity-70" />
                <p className="font-bold text-lg mb-2">Drag and drop video files here</p>
                <p className="text-sm text-paper/50 mb-6">Supports .mp4, .webm up to 500MB</p>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="video/*" />
                <div onClick={() => fileInputRef.current?.click()} className="btn-primary pointer-events-auto cursor-pointer inline-block">Browse Files</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Pack Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-teal" placeholder="e.g. Intro to Algebra" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none">
                <option>Math</option>
                <option>Science</option>
                <option>Computer Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-teal">AI Subtitle Processing</label>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex gap-4 text-sm text-paper/70">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Tamil</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Hindi</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Swahili</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Spanish</label>
            </div>
          </div>

          <button
            disabled={!file || status === 'uploading'}
            onClick={handleUpload}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${!file ? 'bg-white/10 text-white/40 cursor-not-allowed' : status === 'uploading' ? 'bg-teal/50 text-ink animate-pulse' : 'bg-teal text-ink hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,201,167,0.4)]'}`}
          >
            <UploadCloud size={20} /> {status === 'uploading' ? 'Processing...' : 'Upload & Process Pack'}
          </button>
        </div>
      )}
    </div>
  );
}
