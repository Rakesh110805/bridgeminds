import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import { Users, AlertCircle, Award } from 'lucide-react';

export default function MentorAnalytics() {
    const [stats, setStats] = useState({ activeStudents: 0, pendingQuestions: 0, impactScore: 0, mentorReplies: 0 });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/mentor/stats/${user?.id || 'mentor-demo'}`);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center animate-pulse text-paper/50">Loading Analytics...</div>;
    }

    return (
        <div className="space-y-8 animate-fadeUp">
            <div>
                <h1 className="text-3xl font-syne font-bold mb-2">Analytics Overview</h1>
                <p className="text-paper/60">Your global impact metrics and performance insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-glass p-8 border-t-2 border-t-teal flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm uppercase tracking-wider text-paper/60 font-bold">Active Students</div>
                        <div className="p-2 bg-teal/10 rounded-lg text-teal"><Users size={20} /></div>
                    </div>
                    <div className="text-5xl font-syne font-bold text-teal">{stats.activeStudents}</div>
                    <div className="mt-4 text-xs font-bold text-teal/80 bg-teal/5 inline-block px-3 py-1 rounded-full border border-teal/10">Global Reach</div>
                </div>

                <div className="card-glass p-8 border-t-2 border-t-amber flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm uppercase tracking-wider text-paper/60 font-bold">Pending Questions</div>
                        <div className="p-2 bg-amber/10 rounded-lg text-amber"><AlertCircle size={20} /></div>
                    </div>
                    <div className="text-5xl font-syne font-bold text-amber">{stats.pendingQuestions}</div>
                    <div className="mt-4 text-xs font-bold text-amber/80 bg-amber/5 inline-block px-3 py-1 rounded-full border border-amber/10">Awaiting Response</div>
                </div>

                <div className="card-glass p-8 border-t-2 border-t-sky flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm uppercase tracking-wider text-paper/60 font-bold">Impact Score</div>
                        <div className="p-2 bg-sky/10 rounded-lg text-sky"><Award size={20} /></div>
                    </div>
                    <div className="text-5xl font-syne font-bold text-sky">{stats.impactScore}</div>
                    <div className="mt-4 text-xs font-bold text-sky/80 bg-sky/5 inline-block px-3 py-1 rounded-full border border-sky/10">Out of 10.0</div>
                </div>
            </div>

            <div className="card-glass p-8 mt-8">
                <h2 className="text-xl font-syne font-bold mb-6">Engagement Activity</h2>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2 font-bold text-paper/80">
                            <span>Questions Answered</span>
                            <span className="text-teal">{stats.mentorReplies}</span>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-teal transition-all" style={{ width: `${Math.min(100, (stats.mentorReplies / 20) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
