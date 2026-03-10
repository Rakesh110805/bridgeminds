import { useState, useEffect } from 'react';
import { Users, MapPin, Star, Zap, Search } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../components/AuthContext';


export default function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('All');
    const [search, setSearch] = useState('');
    const [requesting, setRequesting] = useState(null);
    const [matched, setMatched] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        api.get('/api/match/all')
            .then(res => setMentors(res.data.mentors || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleRequest = async (mentor) => {
        setRequesting(mentor.id);
        try {
            await new Promise(r => setTimeout(r, 800)); // simulate
            setMatched(mentor.id);
        } finally {
            setRequesting(null);
        }
    };

    // Build dynamic subject list from actual mentor data
    const subjectFilter = ['All', ...new Set(mentors.map(m => m.subject).filter(Boolean))];

    const filtered = mentors.filter(m =>
        (subject === 'All' || m.subject === subject) &&
        (m.name.toLowerCase().includes(search.toLowerCase()) || (m.subject || '').toLowerCase().includes(search.toLowerCase()) || (m.bio || '').toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-fadeUp">
            <header>
                <h1 className="text-3xl font-syne font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-teal to-sky">Find a Mentor</h1>
                <p className="text-paper/60">Connect with expert mentors ready to bridge the gap.</p>
            </header>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
                    <Search size={16} className="text-paper/40" />
                    <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search mentors..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {subjectFilter.map(s => (
                        <button key={s} onClick={() => setSubject(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${subject === s ? 'bg-teal/20 text-teal border border-teal/40' : 'bg-white/5 text-paper/50 border border-white/10 hover:border-white/30'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mentors Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="card-glass h-52 animate-pulse bg-white/5 rounded-2xl" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card-glass p-12 text-center">
                    <Users size={40} className="text-teal/30 mx-auto mb-4" />
                    <p className="text-paper/50">No mentors found. Try a different subject filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((mentor, index) => (
                        <div key={`${mentor.id}_${index}`}
                            className="card-glass p-6 hover:scale-[1.02] transition-all duration-300 group border border-white/5 hover:border-teal/20"
                            style={{ animationDelay: `${index * 80}ms` }}>
                            {/* Avatar & Online Status */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet to-teal flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                                        {mentor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-syne font-bold text-sm group-hover:text-teal transition-colors">{mentor.name}</h3>
                                        <div className="flex items-center gap-1 text-[11px] text-paper/50">
                                            <MapPin size={10} /> {mentor.location}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${mentor.online ? 'bg-lime shadow-[0_0_6px_rgba(200,241,53,0.5)]' : 'bg-white/20'}`} />
                            </div>

                            {/* Subject badge */}
                            <div className="flex gap-2 flex-wrap mb-3">
                                <span className="text-[10px] font-bold px-2 py-1 bg-teal/10 text-teal border border-teal/20 rounded-lg">{mentor.subject}</span>
                                {(Array.isArray(mentor.languages) ? mentor.languages : [mentor.languages]).slice(0, 2).map(l =>
                                    <span key={l} className="text-[10px] font-bold px-2 py-1 bg-violet/10 text-violet border border-violet/20 rounded-lg">{l}</span>
                                )}
                            </div>

                            <p className="text-xs text-paper/50 mb-4 leading-relaxed line-clamp-2">{mentor.bio}</p>

                            {/* Stats */}
                            <div className="flex gap-4 text-[11px] text-paper/50 mb-4">
                                <span className="flex items-center gap-1"><Star size={10} className="text-amber" /> {mentor.responseRate}% rate</span>
                                <span className="flex items-center gap-1"><Zap size={10} className="text-sky" /> {mentor.replies} replies</span>
                            </div>

                            {/* Action */}
                            {matched === mentor.id ? (
                                <div className="w-full py-2.5 text-center rounded-xl bg-lime/10 text-lime border border-lime/30 text-sm font-bold animate-fadeUp">
                                    ✓ Request Sent!
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleRequest(mentor)}
                                    disabled={requesting === mentor.id}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal to-sky text-ink font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                    {requesting === mentor.id ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" /> : 'Request Mentor'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
