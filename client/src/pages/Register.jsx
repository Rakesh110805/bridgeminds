import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'mentor' ? 'MENTOR' : 'STUDENT';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role });
      login(res.data);
    } catch (err) {
      setErrorText(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink overflow-x-hidden font-sans text-paper flex items-center justify-center p-6">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_50%,rgba(76,201,240,0.15)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(0,201,167,0.12)_0%,transparent_60%)]">
        <div className="absolute rounded-full filter blur-[80px] opacity-25 animate-drift bg-sky w-[400px] h-[400px] top-[-50px] left-[-50px]" style={{ animationDelay: '0s' }} />
        <div className="absolute rounded-full filter blur-[80px] opacity-20 animate-drift bg-teal w-[300px] h-[300px] bottom-[-20px] right-[10%]" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-fadeUp">

        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="font-syne text-[2rem] font-extrabold tracking-[-0.03em] mb-2">Join Bridge<span className="text-sky">Minds</span></div>
          <p className="text-[0.9rem] text-white/50">Create an account to break the wall.</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[24px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Role Toggle */}
            <div className="flex gap-3 mb-6 bg-black/20 p-1.5 rounded-[14px]">
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-[10px] text-[0.85rem] font-bold transition-all ${role === 'STUDENT' ? 'bg-sky text-ink shadow-[0_0_15px_rgba(76,201,240,0.4)]' : 'text-white/40 hover:text-white/80'}`}
                onClick={() => setRole('STUDENT')}
              >
                🎓 I'm a Student
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-[10px] text-[0.85rem] font-bold transition-all ${role === 'MENTOR' ? 'bg-teal text-ink shadow-[0_0_15px_rgba(0,201,167,0.4)]' : 'text-white/40 hover:text-white/80'}`}
                onClick={() => setRole('MENTOR')}
              >
                👨‍🏫 I'm a Mentor
              </button>
            </div>

            <div>
              <label className={`block text-[0.75rem] font-bold uppercase tracking-[0.08em] mb-2 ${role === 'MENTOR' ? 'text-teal' : 'text-sky'}`}>Full Name</label>
              <input
                type="text"
                className={`w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] outline-none transition-colors placeholder:text-white/20 ${role === 'MENTOR' ? 'focus:border-teal' : 'focus:border-sky'}`}
                placeholder={role === 'MENTOR' ? "Dr. Amara Osei" : "Priya Kumar"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={`block text-[0.75rem] font-bold uppercase tracking-[0.08em] mb-2 ${role === 'MENTOR' ? 'text-teal' : 'text-sky'}`}>Email Address</label>
              <input
                type="email"
                className={`w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] outline-none transition-colors placeholder:text-white/20 ${role === 'MENTOR' ? 'focus:border-teal' : 'focus:border-sky'}`}
                placeholder={role === 'MENTOR' ? "amara@university.edu" : "priya@bridgeminds.org"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={`block text-[0.75rem] font-bold uppercase tracking-[0.08em] mb-2 ${role === 'MENTOR' ? 'text-teal' : 'text-sky'}`}>Password</label>
              <input
                type="password"
                className={`w-full bg-[#0A0A16]/50 border border-white/10 rounded-xl px-4 py-3.5 text-[0.95rem] outline-none transition-colors placeholder:text-white/20 ${role === 'MENTOR' ? 'focus:border-teal' : 'focus:border-sky'}`}
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
              className={`w-full py-4 mt-4 rounded-xl font-bold text-ink transition-all flex justify-center items-center gap-2 ${role === 'MENTOR' ? 'bg-teal hover:opacity-85' : 'bg-sky hover:opacity-85'}`}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
              ) : 'Create Account →'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[0.85rem] text-white/50">
              Already have an account? <Link to="/login" className={`font-bold hover:underline ${role === 'MENTOR' ? 'text-teal' : 'text-sky'}`}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
