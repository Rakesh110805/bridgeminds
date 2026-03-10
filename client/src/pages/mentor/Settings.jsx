import { useState, useEffect } from 'react';
import { Save, Shield, Bell, Globe, BookOpen, Languages } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';

const SUBJECTS = ['Math', 'Science', 'Computer Science', 'English', 'Career', 'Other'];
const LANGUAGES = ['Tamil', 'Hindi', 'English', 'French', 'Swahili', 'Spanish', 'Telugu', 'Bengali', 'Arabic', 'Yoruba'];
const TIMEZONES = ['UTC-8 (Pacific)', 'UTC-5 (Eastern)', 'UTC+0 (Ghana/UK)', 'UTC+1 (Lagos)', 'UTC+5:30 (India)', 'UTC+8 (China/SEA)'];

function Toggle({ value, onChange }) {
    return (
        <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${value ? 'bg-teal' : 'bg-black/40'}`} onClick={onChange}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${value ? 'left-7' : 'left-1'}`} />
        </div>
    );
}

export default function MentorSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        email: user?.email || 'amara@demo.com',
        notifications: true,
        autoTranslate: true,
        timezone: 'UTC+0 (Ghana/UK)',
        maxStudents: 5,
        subjects: ['Computer Science'],
        languages: ['English', 'Tamil']
    });

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:3001/api/mentor/settings/${user.id}`)
            .then(res => {
                if (res.data && res.data.mentorId) {
                    setSettings({
                        ...res.data,
                        subjects: res.data.subjects ? JSON.parse(res.data.subjects) : ['Computer Science'],
                        languages: res.data.languages ? JSON.parse(res.data.languages) : ['English'],
                    });
                }
            })
            .catch(() => { });
    }, [user]);

    const toggle = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/api/mentor/settings/${user?.id || 'mentor-demo'}`, settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8 animate-fadeUp">
            <div>
                <h1 className="text-3xl font-syne font-bold mb-1">Account Settings</h1>
                <p className="text-paper/60">Manage your profile, preferences, and availability.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile */}
                <div className="card-glass p-6 space-y-4">
                    <h2 className="text-xs uppercase tracking-widest text-teal font-bold flex items-center gap-2"><Shield size={14} /> Profile</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-2 text-paper/60">Display Name</label>
                            <input disabled type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 opacity-50 cursor-not-allowed text-sm" value={user?.name || 'Dr. Amara Osei'} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-2 text-paper/60">Email Address</label>
                            <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none focus:border-teal text-sm transition-colors" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-2 text-paper/60">Timezone</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none text-sm" value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })}>
                                {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-2 text-paper/60">Max Students</label>
                            <input type="number" min={1} max={50} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none focus:border-teal text-sm" value={settings.maxStudents} onChange={e => setSettings({ ...settings, maxStudents: parseInt(e.target.value) })} />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="card-glass p-6 space-y-4">
                    <h2 className="text-xs uppercase tracking-widest text-sky font-bold flex items-center gap-2"><Globe size={14} /> Preferences</h2>
                    {[
                        { key: 'autoTranslate', label: 'Auto-Translate Incoming', desc: 'Automatically translate student languages to English.' },
                        { key: 'notifications', label: 'Push Notifications', desc: 'Receive browser alerts for new student questions.' }
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <h3 className="font-bold text-sm">{label}</h3>
                                <p className="text-xs text-paper/50 mt-1">{desc}</p>
                            </div>
                            <Toggle value={settings[key]} onChange={() => setSettings({ ...settings, [key]: !settings[key] })} />
                        </div>
                    ))}
                </div>

                {/* Subject Expertise */}
                <div className="card-glass p-6 space-y-4">
                    <h2 className="text-xs uppercase tracking-widest text-violet font-bold flex items-center gap-2"><BookOpen size={14} /> Subject Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map(s => (
                            <button key={s} type="button" onClick={() => setSettings({ ...settings, subjects: toggle(settings.subjects, s) })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${settings.subjects.includes(s) ? 'bg-violet/30 text-violet border border-violet/50' : 'bg-white/5 text-paper/50 border border-white/10 hover:border-white/30'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mentoring Languages */}
                <div className="card-glass p-6 space-y-4">
                    <h2 className="text-xs uppercase tracking-widest text-amber font-bold flex items-center gap-2"><Languages size={14} /> Mentoring Languages</h2>
                    <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map(l => (
                            <button key={l} type="button" onClick={() => setSettings({ ...settings, languages: toggle(settings.languages, l) })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${settings.languages.includes(l) ? 'bg-amber/20 text-amber border border-amber/40' : 'bg-white/5 text-paper/50 border border-white/10 hover:border-white/30'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2 text-sm">
                        {loading ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
                    </button>
                    {saved && <span className="text-teal text-sm font-bold animate-fadeUp">✓ Settings saved!</span>}
                </div>
            </form>
        </div>
    );
}
