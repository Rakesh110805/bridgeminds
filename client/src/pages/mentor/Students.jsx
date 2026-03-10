import { useState, useEffect } from 'react';
import { User, MessageCircle, Clock, Search } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../components/AuthContext';

export default function MentorStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchStudents();
    }, [user]);

    const fetchStudents = async () => {
        try {
            const res = await api.get(`/api/mentor/students/${user?.id || 'mentor-demo'}`);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 animate-fadeUp">
            <div>
                <h1 className="text-3xl font-syne font-bold mb-2">My Students</h1>
                <p className="text-paper/60">Overview of the students you are currently mentoring.</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-paper/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-teal transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-paper/50 animate-pulse">
                    Loading student data...
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {filtered.map(s => (
                        <div key={s.id} className="card-glass p-6 flex items-start gap-5 hover:bg-white/5 transition-colors group cursor-pointer border hover:border-teal/30">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky to-teal flex items-center justify-center text-ink font-bold font-syne text-xl">
                                {s.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 group-hover:text-teal transition-colors">{s.name}</h3>
                                <div className="flex items-center gap-4 text-xs text-paper/50 mb-3">
                                    <span className="flex items-center gap-1"><User size={14} /> ID: {s.id.substring(0, 8)}</span>
                                    <span className="flex items-center gap-1 text-teal"><MessageCircle size={14} /> {s.questionsCount} Questions</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[10px] uppercase tracking-wider font-bold bg-white/10 px-2 py-1 rounded">
                                        {s.subject}
                                    </div>
                                    <div className="text-xs text-paper/40 flex items-center gap-1">
                                        <Clock size={12} /> Last active: {s.lastActive}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-2 text-center py-10 text-paper/50">
                            No students match your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
