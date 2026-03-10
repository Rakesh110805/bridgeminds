import { useState, useEffect } from 'react';
import { Download, CheckCircle, WifiOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // simulated fetch
    axios.get(`http://localhost:3001/api/packs/${user?.id || 'demo'}`)
      .then(res => setPacks(res.data))
      .catch(console.error);
  }, [user]);

  const handleDownload = (id) => {
    setPacks(packs.map(p => p.id === id ? { ...p, downloaded: true } : p));
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 animate-fadeUp">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-syne font-bold text-white mb-2">My Learning Packs</h1>
          <p className="text-paper/60">Download lessons to keep learning fully offline.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber/10 px-4 py-2 rounded-full border border-amber/30 text-amber font-bold text-sm">
          <WifiOff size={16} /> Offline Ready Mode Automatically Enabled
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map(pack => (
          <div key={pack.id} className="card-glass p-6 flex flex-col justify-between h-64 hover:bg-white/5 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-sky uppercase tracking-widest">{pack.subject}</span>
                {pack.downloaded ? (
                  <span className="text-lime flex items-center gap-1 text-xs font-bold"><CheckCircle size={14}/> Downloaded</span>
                ) : (
                  <span className="text-paper/40 text-xs font-bold">{pack.size}</span>
                )}
              </div>
              <h3 className="font-syne font-bold text-xl mb-1">{pack.title}</h3>
              <p className="text-sm text-paper/50">{pack.lessons} Lessons • {pack.grade}</p>
            </div>
            
            <div className="mt-6">
              {pack.downloaded ? (
                <>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Progress</span>
                    <span>{pack.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-teal transition-all" style={{ width: `${pack.progress}%` }}></div>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => handleDownload(pack.id)}
                  className="w-full py-3 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition flex justify-center items-center gap-2"
                >
                  <Download size={18} /> Download Pack
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
