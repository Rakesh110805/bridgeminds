import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { GraduationCap, Users } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [errorText, setErrorText] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data);
    } catch {
      setErrorText('Invalid credentials. Use the quick demo buttons below!');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (type) => {
    setDemoLoading(type);
    setErrorText('');
    const creds = type === 'student'
      ? { email: 'priya@demo.com', password: 'demo123' }
      : { email: 'amara@demo.com', password: 'demo123' };
    try {
      const res = await api.post('/api/auth/login', creds);
      login(res.data);
    } catch {
      setErrorText('Demo login failed. Make sure the server is running on port 3001.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink overflow-x-hidden font-sans text-paper flex items-center justify-center p-6">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(0,201,167,0.15)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(76,201,240,0.12)_0%,transparent_60%)]">
        <div className="absolute rounded-full filter blur-[80px] opacity-30 animate-drift bg-teal w-[400px] h-[400px] top-[-50px] right-[-50px]" style={{ animationDelay: '0s' }} />
        <div className="absolute rounded-full filter blur-[80px] opacity-20 animate-drift bg-sky w-[300px] h-[300px] bottom-[-20px] left-[10%]" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fadeUp space-y-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="font-syne text-[2rem] font-extrabold tracking-[-0.03em] mb-1">Bridge<span className="text-teal">Minds</span></div>
          <p className="text-[0.85rem] text-white/40">Breaking Walls. Building Futures.</p>
        </div>

        {/* Quick Demo Buttons — the main way to log in for hackathon */}
        <div className="space-y-2">
          <p className="text-center text-xs text-paper/40 uppercase tracking-widest font-bold">⚡ Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => quickLogin('student')}
              disabled={!!demoLoading}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-teal/10 border border-teal/30 hover:bg-teal/20 transition-all text-sm font-bold text-teal disabled:opacity-50 group">
              {demoLoading === 'student'
                ? <div className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                : <><GraduationCap size={16} className="group-hover:scale-110 transition-transform" /> Student Demo</>}
            </button>
            <button
              onClick={() => quickLogin('mentor')}
              disabled={!!demoLoading}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-violet/10 border border-violet/30 hover:bg-violet/20 transition-all text-sm font-bold text-violet disabled:opacity-50 group">
              {demoLoading === 'mentor'
                ? <div className="w-4 h-4 border-2 border-violet border-t-transparent rounded-full animate-spin" />
                : <><Users size={16} className="group-hover:scale-110 transition-transform" /> Mentor Demo</>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-paper/30 text-xs">or login manually</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Login Form */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[24px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal mb-2">Email Address</label>
              <input
                type="email"
                className="w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] focus:border-teal outline-none transition-colors placeholder:text-white/20"
                placeholder="priya@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] focus:border-teal outline-none transition-colors placeholder:text-white/20"
                placeholder="demo123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorText && (
              <div className="p-3 rounded-lg bg-coral/10 border border-coral/20 text-coral text-[0.8rem] font-medium text-center">
                {errorText}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-3.5 mt-2 flex justify-center items-center gap-2"
              disabled={loading}>
              {loading
                ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                : 'Access Dashboard →'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-6">
            <p className="text-[0.85rem] text-white/50">
              New to BridgeMinds? <Link to="/register" className="text-teal font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>

        {/* Credentials hint */}
        <p className="text-center text-[11px] text-paper/25 pb-2">
          <span className="text-teal/60">priya@demo.com</span> · <span className="text-violet/60">amara@demo.com</span> · password: <span className="text-paper/40">demo123</span>
        </p>
      </div>
    </div>
  );
}
