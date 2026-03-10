import { useState } from 'react';
import { Save, Shield, Bell, Globe } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';

export default function MentorSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        email: user?.email || 'mentor@demo.com',
        notifications: true,
        autoTranslate: true,
        timezone: 'UTC+0 (Ghana)',
        maxStudents: 50
    });

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock save delay
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-3xl space-y-8 animate-fadeUp">
            <div>
                <h1 className="text-3xl font-syne font-bold mb-2">Account Settings</h1>
                <p className="text-paper/60">Manage your profile, preferences, and security.</p>
            </div>

            <div className="card-glass p-8">
                <form onSubmit={handleSave} className="space-y-8">

                    {/* Profile Section */}
                    <section>
                        <h2 className="text-sm uppercase tracking-widest text-teal font-bold mb-4 flex items-center gap-2">
                            <Shield size={16} /> Security & Profile
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold mb-2 text-paper/60">Display Name</label>
                                <input
                                    disabled
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 opacity-50 cursor-not-allowed text-sm"
                                    value={user?.name || 'Dr. Amara Osei'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-2 text-paper/60">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 outline-none focus:border-teal text-sm transition-colors"
                                    value={settings.email}
                                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5" />

                    {/* Preferences Section */}
                    <section>
                        <h2 className="text-sm uppercase tracking-widest text-teal font-bold mb-4 flex items-center gap-2">
                            <Globe size={16} /> Global Hub Preferences
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <h3 className="font-bold text-sm">Auto-Translate Incoming Messages</h3>
                                    <p className="text-xs text-paper/50 mt-1">Automatically translate student languages (Swahili, Tamil, etc.) to English.</p>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${settings.autoTranslate ? 'bg-teal' : 'bg-black/40'}`}
                                    onClick={() => setSettings({ ...settings, autoTranslate: !settings.autoTranslate })}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoTranslate ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <h3 className="font-bold text-sm">Push Notifications</h3>
                                    <p className="text-xs text-paper/50 mt-1">Receive browser alerts for new queued questions.</p>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${settings.notifications ? 'bg-sky' : 'bg-black/40'}`}
                                    onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center gap-4 pt-4">
                        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2 text-sm">
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <><Save size={16} /> Save Changes</>
                            )}
                        </button>
                        {saved && <span className="text-teal text-sm font-bold animate-fadeUp">Settings saved successfully!</span>}
                    </div>

                </form>
            </div>
        </div>
    );
}
