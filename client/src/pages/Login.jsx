import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocked to localhost for demo
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      login(res.data);
    } catch {
      alert('Login failed. Try demo@demo.com with any password for hackathon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-[80px]" />
      <div className="card-glass w-full max-w-md p-8 relative z-10 animate-fadeUp">
        <h2 className="text-3xl font-syne font-bold mb-6 text-center text-teal">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-teal outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-teal outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-paper/60">
          New here? <Link to="/register" className="text-teal font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
