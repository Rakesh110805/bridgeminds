import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      login(res.data);
    } catch {
      setErrorText('Login failed. Try demo@demo.com with any password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink overflow-x-hidden font-sans text-paper flex items-center justify-center p-6">

      {/* Animated Background (Matched from Landing) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(0,201,167,0.15)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(76,201,240,0.12)_0%,transparent_60%)]">
        <div className="absolute rounded-full filter blur-[80px] opacity-30 animate-drift bg-teal w-[400px] h-[400px] top-[-50px] right-[-50px]" style={{ animationDelay: '0s' }} />
        <div className="absolute rounded-full filter blur-[80px] opacity-20 animate-drift bg-sky w-[300px] h-[300px] bottom-[-20px] left-[10%]" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fadeUp">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="font-syne text-[2rem] font-extrabold tracking-[-0.03em] mb-2">Bridge<span className="text-teal">Minds</span></div>
          <p className="text-[0.9rem] text-white/50">Welcome back! Log in to continue.</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[24px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[0.75rem] font-bold uppercase tracking-[0.08em] text-teal mb-2">Email Address</label>
              <input
                type="email"
                className="w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] focus:border-teal outline-none transition-colors placeholder:text-white/20"
                placeholder="priya@bridgeminds.org"
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
                placeholder="••••••••"
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
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
              ) : 'Access Dashboard →'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[0.85rem] text-white/50">
              New to BridgeMinds? <Link to="/register" className="text-teal font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
