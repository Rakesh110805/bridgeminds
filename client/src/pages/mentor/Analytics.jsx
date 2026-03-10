import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import { Users, AlertCircle, Award, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#00C9A7', '#4CC9F0', '#7B2FBE', '#FFB830', '#FF6B6B', '#C8F135'];

function StatCard({ label, value, icon: Icon, color, sub }) {
    const colors = { teal: 'text-teal border-t-teal', sky: 'text-sky border-t-sky', amber: 'text-amber border-t-amber', violet: 'text-violet border-t-violet' };
    return (
        <div className={`card-glass p-6 border-t-2 ${colors[color]} flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
            <div className="flex justify-between items-start mb-4">
                <div className="text-xs uppercase tracking-wider text-paper/60 font-bold">{label}</div>
                <Icon size={18} className={`text-${color}`} />
            </div>
            <div className={`text-4xl font-syne font-bold text-${color}`}>{value}</div>
            {sub && <div className="mt-2 text-xs text-paper/40">{sub}</div>}
        </div>
    );
}

export default function MentorAnalytics() {
    const [stats, setStats] = useState(null);
    const [basicStats, setBasicStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [analyticsRes, basicRes] = await Promise.all([
                    axios.get(`http://localhost:3001/api/mentor/analytics/${user?.id || 'mentor-demo'}`),
                    axios.get(`http://localhost:3001/api/mentor/stats/${user?.id || 'mentor-demo'}`)
                ]);
                setStats(analyticsRes.data);
                setBasicStats(basicRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="card-glass h-28 rounded-2xl bg-white/5" />)}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => <div key={i} className="card-glass h-64 rounded-2xl bg-white/5" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeUp">
            <div>
                <h1 className="text-3xl font-syne font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-teal to-sky">Impact Dashboard</h1>
                <p className="text-paper/60">Your global mentorship impact, live from the data.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Students Helped" value={stats?.totalStudentsHelped ?? 0} icon={Users} color="teal" sub="Unique learners" />
                <StatCard label="Replies Sent" value={stats?.repliesSent ?? 0} icon={TrendingUp} color="sky" sub="Total answers" />
                <StatCard label="Avg Response" value={`${stats?.avgResponseHours ?? 0}h`} icon={Clock} color="amber" sub="Per question" />
                <StatCard label="Pending" value={basicStats?.pendingQuestions ?? 0} icon={AlertCircle} color="violet" sub="Need response" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Questions over time */}
                <div className="card-glass p-6">
                    <h2 className="text-xs uppercase tracking-widest text-teal font-bold mb-6">Questions Over Time (14 Days)</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stats?.questionsOverTime || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: '#F7F4EE', fontSize: 10, opacity: 0.4 }} tickLine={false} />
                            <YAxis tick={{ fill: '#F7F4EE', fontSize: 10, opacity: 0.4 }} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F7F4EE' }} />
                            <Line type="monotone" dataKey="count" stroke="#00C9A7" strokeWidth={2} dot={{ fill: '#00C9A7', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Questions by subject */}
                <div className="card-glass p-6">
                    <h2 className="text-xs uppercase tracking-widest text-sky font-bold mb-6">Questions by Subject</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats?.bySubject || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="subject" tick={{ fill: '#F7F4EE', fontSize: 10, opacity: 0.4 }} tickLine={false} />
                            <YAxis tick={{ fill: '#F7F4EE', fontSize: 10, opacity: 0.4 }} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F7F4EE' }} />
                            <Bar dataKey="count" fill="#4CC9F0" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Language distribution */}
                <div className="card-glass p-6">
                    <h2 className="text-xs uppercase tracking-widest text-violet font-bold mb-6">Language Distribution</h2>
                    {(stats?.byLanguage || []).length > 0 ? (
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="60%" height={180}>
                                <PieChart>
                                    <Pie data={stats.byLanguage} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                                        {stats.byLanguage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F7F4EE' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 flex-1">
                                {stats.byLanguage.slice(0, 5).map((lang, i) => (
                                    <div key={lang.language} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                                        <span className="text-xs text-paper/70 flex-1">{lang.language}</span>
                                        <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>{lang.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-paper/30 text-sm">No language data yet</div>
                    )}
                </div>

                {/* Impact Score */}
                <div className="card-glass p-6">
                    <h2 className="text-xs uppercase tracking-widest text-amber font-bold mb-6">Impact Score</h2>
                    <div className="flex items-center justify-center h-[180px]">
                        <div className="text-center">
                            <div className="text-8xl font-syne font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber to-coral">
                                {basicStats?.impactScore || '0.0'}
                            </div>
                            <div className="text-paper/40 text-sm mt-2">out of 10.0</div>
                            <div className="mt-4 px-4 py-2 bg-amber/10 border border-amber/20 rounded-xl text-xs text-amber font-bold">
                                {basicStats?.mentorReplies || 0} Answers Contributed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
