import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'mentor' ? 'MENTOR' : 'STUDENT';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', { name, email, password, role });
      login(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky/10 rounded-full blur-[80px]" />
      <div className="card-glass w-full max-w-md p-8 relative z-10 animate-fadeUp">
        <h2 className="text-3xl font-syne font-bold mb-6 text-center text-sky">Join BridgeMinds</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button 
              type="button"
              className={`flex-1 py-2 rounded-xl text-sm font-bold border ${role === 'STUDENT' ? 'bg-sky text-ink border-sky' : 'border-white/20'}`}
              onClick={() => setRole('STUDENT')}
            >
              Student
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 rounded-xl text-sm font-bold border ${role === 'MENTOR' ? 'bg-teal text-ink border-teal' : 'border-white/20'}`}
              onClick={() => setRole('MENTOR')}
            >
              Mentor
            </button>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-sky outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-sky outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-sky outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className={`w-full mt-4 py-3 rounded-xl font-bold text-ink transition-all ${role === 'MENTOR' ? 'bg-teal hover:bg-teal/80' : 'bg-sky hover:bg-sky/80'}`} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-paper/60">
          Already have an account? <Link to="/login" className="text-sky font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
