import { ArrowRight, Mic, Globe2, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-ink overflow-x-hidden font-sans text-paper">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 bg-[#0D0D1A]/85 backdrop-blur-md border-b border-white/5">
        <div className="font-syne text-[1.4rem] font-extrabold tracking-[-0.03em]">Bridge<span className="text-teal">Minds</span></div>
        <div className="flex gap-2">
          <a className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium bg-white/5 text-white/60 hover:bg-teal hover:text-ink transition-all no-underline" href="#problem">Problem</a>
          <a className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium bg-white/5 text-white/60 hover:bg-teal hover:text-ink transition-all no-underline" href="#flow">Flow</a>
          <a className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium bg-white/5 text-white/60 hover:bg-teal hover:text-ink transition-all no-underline" href="#student-ui">Student UI</a>
          <a className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium bg-white/5 text-white/60 hover:bg-teal hover:text-ink transition-all no-underline" href="#mentor-ui">Mentor</a>
          <a className="px-4 py-1.5 rounded-full text-[0.8rem] font-medium bg-white/5 text-white/60 hover:bg-teal hover:text-ink transition-all no-underline" href="#hub">Village Hub</a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" className="min-h-screen flex items-center pt-28 px-12 pb-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(0,201,167,0.15)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(76,201,240,0.12)_0%,transparent_60%),radial-gradient(ellipse_30%_50%_at_60%_10%,rgba(123,47,190,0.1)_0%,transparent_60%)]">
          <div className="absolute rounded-full filter blur-[60px] opacity-25 animate-drift bg-teal w-[500px] h-[500px] top-[-100px] right-[-100px]" style={{ animationDelay: '0s' }} />
          <div className="absolute rounded-full filter blur-[60px] opacity-25 animate-drift bg-sky w-[350px] h-[350px] bottom-[-50px] left-[10%]" style={{ animationDelay: '-4s' }} />
          <div className="absolute rounded-full filter blur-[60px] opacity-25 animate-drift bg-amber w-[250px] h-[250px] top-[30%] left-[40%]" style={{ animationDelay: '-8s' }} />
        </div>

        <div className="relative z-10 max-w-[700px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/15 border border-teal/30 text-[0.78rem] font-medium text-teal mb-8 animate-fadeUp">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-[pulse-dot_2s_infinite]" />
            24-Hour Hackathon Project
          </div>

          <h1 className="font-syne text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em] mb-6 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            Breaking Walls.<br />
            <span className="bg-gradient-to-br from-teal to-sky bg-clip-text text-transparent">Building Futures.</span>
          </h1>

          <p className="text-[1.15rem] font-light leading-[1.7] text-white/65 max-w-[520px] mb-10 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            AI-powered mentorship that works without internet, across any language, for every rural student — no matter where they are.
          </p>

          <div className="flex gap-4 flex-wrap animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <Link to="/register?role=student" className="btn-primary">▶ See How It Works</Link>
            <a href="#student-ui" className="btn-outline">View UI</a>
          </div>

          <div className="flex gap-12 mt-16 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
            <div>
              <div className="font-syne text-[2.2rem] font-extrabold leading-none text-teal">500M+</div>
              <div className="text-[0.78rem] text-white/50 mt-1 uppercase tracking-[0.08em]">Underserved Students</div>
            </div>
            <div>
              <div className="font-syne text-[2.2rem] font-extrabold leading-none text-amber">7,000+</div>
              <div className="text-[0.78rem] text-white/50 mt-1 uppercase tracking-[0.08em]">Languages Covered</div>
            </div>
            <div>
              <div className="font-syne text-[2.2rem] font-extrabold leading-none text-coral">37%</div>
              <div className="text-[0.78rem] text-white/50 mt-1 uppercase tracking-[0.08em]">Without Internet</div>
            </div>
          </div>
        </div>

        {/* Floating cards visual */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 animate-fadeUp hidden lg:flex" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 w-[260px] animate-float">
            <div className="text-[0.7rem] uppercase tracking-[0.1em] text-white/40 mb-2">🎙️ Voice Translated</div>
            <div className="text-[0.88rem] font-medium">"நான் என்ஜினியர் ஆக விரும்புகிறேன்"</div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-semibold mt-2 bg-teal/20 text-teal">→ English</span>
          </div>
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 w-[260px] animate-float ml-8" style={{ animationDelay: '-2s' }}>
            <div className="text-[0.7rem] uppercase tracking-[0.1em] text-white/40 mb-2">🤖 AI Mentor Reply</div>
            <div className="text-[0.88rem] font-medium">Start with Python basics. Here's your first lesson pack…</div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-semibold mt-2 bg-amber/20 text-amber">Offline Ready</span>
          </div>
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 w-[260px] animate-float" style={{ animationDelay: '-4s' }}>
            <div className="text-[0.7rem] uppercase tracking-[0.1em] text-white/40 mb-2">📶 Connectivity</div>
            <div className="text-[0.88rem] font-medium">12 students synced via Village Hub — 2G window used</div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-semibold mt-2 bg-coral/20 text-coral">Async Mode</span>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section id="problem" className="py-24 px-12 relative bg-[#0A0A16]">
        <div className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-teal mb-3">The Problem</div>
        <h2 className="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-4">Three walls.<br />One solution.</h2>
        <p className="text-base text-white/55 max-w-[480px] leading-[1.7] mb-12">Every existing platform assumes language, internet, and a personal device. Rural students have none of these.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="problem-card c1">
            <div className="text-[2.5rem] mb-4">🌐</div>
            <div className="font-syne text-[1.2rem] font-bold mb-2">Language Wall</div>
            <div className="text-[0.88rem] text-white/60 leading-[1.65]">Mentors speak English. Rural students speak Swahili, Tamil, Quechua, Yoruba. Zero platforms bridge this gap with voice.</div>
            <div className="font-syne text-[2.5rem] font-extrabold mt-4 text-coral">7,000+</div>
            <div className="text-[0.75rem] text-[rgba(255,107,107,0.6)] mt-1">languages spoken globally</div>
          </div>
          <div className="problem-card c2">
            <div className="text-[2.5rem] mb-4">📶</div>
            <div className="font-syne text-[1.2rem] font-bold mb-2">Connectivity Wall</div>
            <div className="text-[0.88rem] text-white/60 leading-[1.65]">No 4G. No WiFi. Intermittent 2G that drops every 20 minutes. Live video calls and real-time apps are useless.</div>
            <div className="font-syne text-[2.5rem] font-extrabold mt-4 text-amber">37%</div>
            <div className="text-[0.75rem] text-[rgba(255,184,48,0.6)] mt-1">of rural populations offline</div>
          </div>
          <div className="problem-card c3">
            <div className="text-[2.5rem] mb-4">📱</div>
            <div className="font-syne text-[1.2rem] font-bold mb-2">Device Wall</div>
            <div className="text-[0.88rem] text-white/60 leading-[1.65]">No personal smartphone. Shared devices at best. Power cuts. Apps that require 4GB RAM simply don't open.</div>
            <div className="font-syne text-[2.5rem] font-extrabold mt-4 text-sky">500M+</div>
            <div className="text-[0.75rem] text-[rgba(76,201,240,0.6)] mt-1">students hit all 3 walls</div>
          </div>
        </div>
      </section>

      {/* ─── FLOW ─── */}
      <section id="flow" className="py-24 px-12 relative bg-ink">
        <div className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-teal mb-3">Core Flow</div>
        <h2 className="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-4">5 steps. Zero<br />internet required.</h2>
        <p className="text-base text-white/55 max-w-[480px] leading-[1.7] mb-12">The entire student→mentor→student loop works offline. Internet only needed for the sync window.</p>

        <div className="flex flex-col max-w-[800px] mx-auto">
          {/* Step 1 */}
          <div className="flex gap-8 items-start py-8 relative">
            <div className="absolute left-[1.75rem] top-[5rem] bottom-0 w-0.5 bg-gradient-to-b from-[rgba(0,201,167,0.4)] to-[rgba(0,201,167,0.05)]" />
            <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-syne text-[1.1rem] font-extrabold z-10 bg-[rgba(0,201,167,0.2)] border-2 border-teal text-teal">1</div>
            <div className="flex-1">
              <div className="font-syne text-[1.2rem] font-bold mb-1.5">Student Records Voice Question</div>
              <div className="text-[0.9rem] text-white/55 leading-[1.65]">Student speaks in their native language — Tamil, Swahili, Hindi, Spanish — into the BridgeMinds app or Village Hub device. No typing needed.</div>
              <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white/5 text-white/50">🎙️ Voice Input · Local Language</span>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex gap-8 items-start py-8 relative">
            <div className="absolute left-[1.75rem] top-[5rem] bottom-0 w-0.5 bg-gradient-to-b from-sky/40 to-sky/5" />
            <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-syne text-[1.1rem] font-extrabold z-10 bg-[rgba(76,201,240,0.2)] border-2 border-sky text-sky">2</div>
            <div className="flex-1">
              <div className="font-syne text-[1.2rem] font-bold mb-1.5">AI Transcribes + Translates</div>
              <div className="text-[0.9rem] text-white/55 leading-[1.65]">Whisper API transcribes the voice to text. NLLB-200 translates to the mentor's language. Question queued if offline — sent during next sync window.</div>
              <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white/5 text-white/50">🤖 Whisper · NLLB-200 · Async Queue</span>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex gap-8 items-start py-8 relative">
            <div className="absolute left-[1.75rem] top-[5rem] bottom-0 w-0.5 bg-gradient-to-b from-amber/40 to-amber/5" />
            <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-syne text-[1.1rem] font-extrabold z-10 bg-amber/20 border-2 border-amber text-amber">3</div>
            <div className="flex-1">
              <div className="font-syne text-[1.2rem] font-bold mb-1.5">Mentor Sees Translated Question</div>
              <div className="text-[0.9rem] text-white/55 leading-[1.65]">Global mentor gets a clean dashboard notification with the translated question, student's subject tag, grade, and learning context. Replies via text or short video.</div>
              <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white/5 text-white/50">💬 Mentor Dashboard · Async Reply</span>
            </div>
          </div>
          {/* Step 4 */}
          <div className="flex gap-8 items-start py-8 relative">
            <div className="absolute left-[1.75rem] top-[5rem] bottom-0 w-0.5 bg-gradient-to-b from-coral/40 to-coral/5" />
            <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-syne text-[1.1rem] font-extrabold z-10 bg-coral/20 border-2 border-coral text-coral">4</div>
            <div className="flex-1">
              <div className="font-syne text-[1.2rem] font-bold mb-1.5">AI Translates Back + Reads Aloud</div>
              <div className="text-[0.9rem] text-white/55 leading-[1.65]">Reply is translated back to the student's language. Text-to-speech reads it aloud — even if the student has low literacy. Student can listen without reading.</div>
              <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white/5 text-white/50">🔊 TTS · Multilingual · Inclusive</span>
            </div>
          </div>
          {/* Step 5 */}
          <div className="flex gap-8 items-start py-8 relative">
            <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-syne text-[1.1rem] font-extrabold z-10 bg-lime/20 border-2 border-lime text-lime">5</div>
            <div className="flex-1">
              <div className="font-syne text-[1.2rem] font-bold mb-1.5">AI Tutor Fills the Gaps</div>
              <div className="text-[0.9rem] text-white/55 leading-[1.65]">When mentors are unavailable (time zones, weekends), the Claude-powered AI Tutor answers instantly using mentor-uploaded knowledge. No dead time for the student.</div>
              <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white/5 text-white/50">⚡ Claude API · 24/7 Fallback</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STUDENT UI MOCKUP ─── */}
      <section id="student-ui" className="py-24 px-12 relative bg-[#07090F]">
        <div className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-teal mb-3">Student Experience</div>
        <h2 className="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-4">Designed for Priya.<br />Works for everyone.</h2>
        <p className="text-base text-white/55 max-w-[480px] leading-[1.7] mb-12">Voice-first, offline-capable, multilingual. Built for a 14-year-old in rural Tamil Nadu with a shared tablet and patchy 2G.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Phone Mockup */}
          <div className="flex justify-center">
            <div className="w-[280px] bg-[#111827] rounded-[36px] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.6)] box-border relative border border-white/5">
              <div className="w-[90px] h-[22px] bg-black rounded-b-[14px] mx-auto mb-2" />
              <div className="bg-gradient-to-br from-[#0F1923] to-[#0A1628] rounded-[26px] overflow-hidden p-4 min-h-[480px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-syne text-[0.9rem] font-bold">BridgeMinds</div>
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-[0.75rem] font-bold text-ink">P</div>
                </div>

                <div className="text-[0.62rem] opacity-50 mb-1 uppercase tracking-wider">Mentor Dr. Amara</div>
                <div className="bg-white/5 text-white/80 self-start rounded-[14px] p-2.5 mb-2.5 max-w-[85%] text-[0.78rem] leading-[1.5]">
                  Start with variables and loops. I've uploaded a lesson pack for you — it works offline! 🎯
                </div>

                <div className="text-[0.62rem] opacity-50 mb-1 uppercase tracking-wider mt-3">You (Tamil)</div>
                <div className="bg-gradient-to-br from-teal to-[#00a88a] text-ink font-medium ml-auto rounded-[14px] p-2.5 mb-2.5 max-w-[85%] text-[0.78rem] leading-[1.5]">
                  Python-ல் loops எப்படி use பண்றது?
                </div>

                <div className="text-[0.62rem] opacity-50 mb-1 uppercase tracking-wider mt-3">🤖 AI Tutor (instant)</div>
                <div className="bg-sky/10 border border-sky/20 text-sky rounded-[14px] p-2.5 mb-2.5 max-w-[85%] text-[0.78rem] leading-[1.5]">
                  Great question! A loop repeats code. Think of it like writing "good morning" 10 times — a loop does it automatically. Want an example?
                </div>

                <button className="flex items-center gap-2.5 bg-teal rounded-full px-5 py-3 mt-4 text-[0.8rem] font-bold text-ink w-full border-none cursor-pointer animate-breathe">
                  <div className="w-2 h-2 bg-ink rounded-full animate-[pulse-dot_1.2s_infinite]" />
                  Hold to Ask in Tamil
                </button>

                <div className="flex gap-2 mt-4">
                  <div className="flex-1 bg-white/5 rounded-[10px] p-2.5 text-center text-[0.7rem] text-white/40">
                    📦 3 Packs<br /><span className="text-teal font-semibold">Ready</span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-[10px] p-2.5 text-center text-[0.7rem] text-white/40">
                    📶 Offline<br /><span className="text-amber font-semibold">Syncs 8PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-5 py-4">
            {[
              { id: '1', i: '🎙️', c: 'bg-teal/15', text: 'Voice-First Input', desc: 'Students speak in any language. No keyboard. No literacy barrier. AI handles the rest.' },
              { id: '2', i: '📦', c: 'bg-amber/15', text: 'Offline Learning Packs', desc: 'Mentor-created micro-lessons downloaded to device. Full course access with zero internet.' },
              { id: '3', i: '🤖', c: 'bg-sky/15', text: 'AI Tutor — Always On', desc: 'Claude-powered tutor answers instantly when mentors are sleeping or busy.' },
              { id: '4', i: '🔊', c: 'bg-lime/15', text: 'Text-to-Speech Replies', desc: "Mentor's answer is read aloud in the student's language. Works even for low-literacy students." },
              { id: '5', i: '📶', c: 'bg-coral/15', text: 'Async Sync Queue', desc: 'Everything queued locally. Syncs during the next connectivity window, even a brief 2G pulse.' },
            ].map(f => (
              <div key={f.id} className="flex gap-5 items-start p-5 bg-white/5 border border-white/5 rounded-2xl transition-all hover:bg-teal/5 hover:border-teal/20 hover:translate-x-1">
                <div className={`w-[42px] h-[42px] rounded-xl shrink-0 flex items-center justify-center text-[1.3rem] ${f.c}`}>{f.i}</div>
                <div>
                  <div className="font-syne text-[0.95rem] font-bold mb-1">{f.text}</div>
                  <div className="text-[0.82rem] text-white/50 leading-[1.55]">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── MENTOR DASHBOARD ─── */}
      <section id="mentor-ui" className="py-24 px-12 relative bg-ink">
        <div className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-teal mb-3">Mentor Experience</div>
        <h2 className="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-4">Global mentors.<br />Local impact.</h2>
        <p className="text-base text-white/55 max-w-[480px] leading-[1.7] mb-12">A clean dashboard where mentors receive translated student questions, track progress, and reply asynchronously — no scheduling headache.</p>

        <div className="bg-[#111827] rounded-[20px] overflow-hidden border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 px-6 bg-[#0D1321] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
            </div>
            <div className="text-[0.8rem] text-white/40">BridgeMinds — Mentor Portal</div>
            <div className="text-[0.75rem] text-white/30">Dr. Amara Osei · Computer Science</div>
          </div>

          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Sidebar */}
            <div className="bg-[#0D1321] border-r border-white/5 p-5 w-full md:w-[220px]">
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 bg-teal/10 text-teal">
                📬 Inbox <span className="ml-auto bg-coral text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">3</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">👥 My Students</div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">📦 Upload Lessons</div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">📊 Progress</div>
              <div className="text-[0.65rem] uppercase tracking-[0.1em] text-white/30 my-4">Tools</div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">🔴 Live Session</div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">🌐 Translate</div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] text-[0.82rem] cursor-pointer mb-1 text-white/50 hover:bg-white/5 hover:text-white/80">⚙️ Settings</div>
            </div>

            {/* Content Display */}
            <div className="p-6 flex-1 overflow-hidden">
              <div className="font-syne text-[1.1rem] font-bold mb-5">Good morning, Dr. Amara 👋</div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                  <div className="font-syne text-[1.6rem] font-extrabold text-teal">12</div>
                  <div className="text-[0.7rem] text-white/40 mt-1">Active Students</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                  <div className="font-syne text-[1.6rem] font-extrabold text-amber">3</div>
                  <div className="text-[0.7rem] text-white/40 mt-1">New Questions</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                  <div className="font-syne text-[1.6rem] font-extrabold text-sky">94%</div>
                  <div className="text-[0.7rem] text-white/40 mt-1">Satisfaction</div>
                </div>
              </div>

              <div className="text-[0.78rem] font-semibold text-white/40 uppercase tracking-[0.08em] mb-3">Incoming Questions</div>

              {/* Msg 1 */}
              <div className="bg-white/5 rounded-[14px] p-4 mb-3 border border-white/5 hover:border-teal/30 transition-colors">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber to-coral flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0">P</div>
                  <div>
                    <div className="text-[0.82rem] font-semibold">Priya, 14 — Tamil Nadu, India</div>
                    <div className="text-[0.7rem] text-white/35">Received 2h ago · via Village Hub sync</div>
                  </div>
                  <span className="ml-auto px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold bg-teal/15 text-teal">Python</span>
                </div>
                <div className="text-[0.82rem] text-white/60 leading-[1.55] mb-2">How do I use loops in Python to repeat a task? I tried but got an error.</div>
                <div className="text-[0.75rem] text-teal/70 italic">🌐 Translated from Tamil by AI</div>
                <button className="px-4 py-1.5 rounded-lg bg-teal text-ink text-[0.75rem] font-semibold mt-2.5 hover:opacity-85 transition-opacity">Reply in English →</button>
              </div>

              {/* Msg 2 */}
              <div className="bg-white/5 rounded-[14px] p-4 mb-3 border border-white/5 hover:border-teal/30 transition-colors">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0">K</div>
                  <div>
                    <div className="text-[0.82rem] font-semibold">Kofi, 16 — Accra Rural, Ghana</div>
                    <div className="text-[0.7rem] text-white/35">Received 5h ago · via SMS queue</div>
                  </div>
                  <span className="ml-auto px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold bg-sky/15 text-sky">Maths</span>
                </div>
                <div className="text-[0.82rem] text-white/60 leading-[1.55] mb-2">Can you explain what a function is with a real-world example?</div>
                <div className="text-[0.75rem] text-teal/70 italic">🌐 Translated from Twi by AI</div>
                <button className="px-4 py-1.5 rounded-lg bg-teal text-ink text-[0.75rem] font-semibold mt-2.5 hover:opacity-85 transition-opacity">Reply in English →</button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── VILLAGE HUB ─── */}
      <section id="hub" className="py-24 px-12 relative bg-[#08080F]">
        <div className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-teal mb-3">Village Hub Model</div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <h2 className="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-4">One device.<br />50 students.</h2>
            <p className="text-base text-white/55 max-w-[480px] leading-[1.7] mb-8">A solar-powered offline hub at each village school. Students don't need personal devices or home internet.</p>

            <div className="flex flex-col gap-5">
              {[
                { i: '☀️', t: 'Solar Powered', d: 'Operates on solar power — no grid electricity required. Designed for the most remote locations.' },
                { i: '🔄', t: 'Smart Sync Windows', d: 'Batches all student questions and mentor replies during brief 2G/WiFi windows — even 5 minutes is enough.' },
                { i: '🏫', t: 'Coordinator-Led', d: 'A trained local teacher or volunteer manages the hub — no technical expertise needed.' },
                { i: '📡', t: 'Global Reach', d: 'Each hub connects 20–50 students to mentors worldwide. One device, endless possibility.' }
              ].map((h, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-[14px]">
                  <div className="text-[1.5rem] shrink-0 w-10 text-center">{h.i}</div>
                  <div>
                    <div className="font-semibold text-[0.9rem] mb-1">{h.t}</div>
                    <div className="text-[0.8rem] text-white/50 leading-[1.55]">{h.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagram */}
          <div className="relative h-[380px] overflow-hidden">
            {/* Center School / Hub Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-3xl bg-gradient-to-br from-teal to-sky flex justify-center items-center text-[2.5rem] shadow-[0_0_60px_rgba(0,201,167,0.4)] z-20">🏫</div>

            {/* Concentric rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-teal/20 animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] rounded-full border border-dashed border-sky/15 animate-spin-slow [animation-direction:reverse] [animation-duration:30s]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[370px] h-[370px] rounded-full border border-dashed border-amber/10 animate-spin-slow [animation-duration:40s]" />

            {/* Orbiting student / mentor nodes overlay using positional absolute relative to the wrapper */}
            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-amber/20 border border-amber/40 top-[5%] left-1/2 -translate-x-1/2">👧</div>
            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-amber/20 border border-amber/40 bottom-[18%] right-[8%]">👦</div>
            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-amber/20 border border-amber/40 bottom-[18%] left-[8%]">👧</div>

            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-sky/20 border border-sky/40 top-[18%] right-[8%]">👨💻</div>
            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-sky/20 border border-sky/40 bottom-[5%] left-1/2 -translate-x-1/2">👩🏫</div>
            <div className="absolute w-12 h-12 rounded-full flex items-center justify-center text-[1.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-sky/20 border border-sky/40 top-[18%] left-[8%]">👨🔬</div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#050508] border-t border-white/5 p-12 text-center">
        <div className="font-syne text-[2rem] font-extrabold mb-2">Bridge<span className="text-teal">Minds</span></div>
        <div className="text-[0.85rem] text-white/30">AI-Assisted Global Mentorship · Built in 24 Hours</div>
        <div className="inline-block mt-6 px-5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-[0.78rem] font-semibold">🏆 Hackathon 2025</div>
      </footer>

    </main>
  );
}
