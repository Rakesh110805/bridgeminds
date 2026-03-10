const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure mentor_profiles table exists for richer mentor info
db.exec(`
  CREATE TABLE IF NOT EXISTS mentor_profiles (
    mentorId TEXT PRIMARY KEY,
    bio TEXT DEFAULT 'Expert mentor on BridgeMinds.',
    location TEXT DEFAULT 'Global',
    languages TEXT DEFAULT '["English"]',
    subjects TEXT DEFAULT '["General"]',
    responseRate INTEGER DEFAULT 85,
    online INTEGER DEFAULT 0,
    FOREIGN KEY (mentorId) REFERENCES users(id)
  );
`);

// POST /api/match - scored mentor matching for a student
router.post('/', (req, res) => {
  const { subject, language } = req.body;

  const mentors = db.prepare(`
    SELECT u.id, u.name,
           mp.bio, mp.location, mp.languages, mp.subjects,
           mp.responseRate, mp.online,
           COUNT(r.id) as replies
    FROM users u
    LEFT JOIN mentor_profiles mp ON u.id = mp.mentorId
    LEFT JOIN replies r ON u.id = r.mentorId
    WHERE u.role = 'MENTOR'
    GROUP BY u.id
  `).all().map(m => {
    let langs = ['English'];
    let subs = ['General'];
    try { langs = JSON.parse(m.languages || '["English"]'); } catch { }
    try { subs = JSON.parse(m.subjects || '["General"]'); } catch { }

    const primarySubject = subs[0] || 'General';
    const score =
      (subject && primarySubject.toLowerCase() === subject.toLowerCase() ? 2 : 0) +
      (m.online ? 1 : 0) +
      ((m.responseRate || 85) > 90 ? 1 : 0) +
      (language && langs.some(l => l.toLowerCase().includes(language.toLowerCase())) ? 1 : 0);

    return { ...m, languages: langs, subjects: subs, subject: primarySubject, score };
  }).sort((a, b) => b.score - a.score);

  res.json({ mentors: mentors.slice(0, 6) });
});

// GET /api/match/all - all mentors for the Find Mentor page
router.get('/all', (req, res) => {
  const mentors = db.prepare(`
    SELECT u.id, u.name,
           mp.bio, mp.location, mp.languages, mp.subjects,
           mp.responseRate, mp.online,
           COUNT(r.id) as replies
    FROM users u
    LEFT JOIN mentor_profiles mp ON u.id = mp.mentorId
    LEFT JOIN replies r ON u.id = r.mentorId
    WHERE u.role = 'MENTOR'
    GROUP BY u.id
  `).all().map(m => {
    let langs = ['English'];
    let subs = ['General'];
    try { langs = JSON.parse(m.languages || '["English"]'); } catch { }
    try { subs = JSON.parse(m.subjects || '["General"]'); } catch { }
    return {
      ...m,
      languages: langs,
      subjects: subs,
      subject: subs[0] || 'General',
      location: m.location || 'Global',
      bio: m.bio || 'Expert mentor on BridgeMinds.',
      responseRate: m.responseRate || 85,
      online: !!m.online
    };
  });

  res.json({ mentors });
});

// PUT /api/match/profile - mentor updates their own profile
router.put('/profile', (req, res) => {
  const { mentorId, bio, location, languages, subjects, responseRate, online } = req.body;
  if (!mentorId) return res.status(400).json({ error: 'Missing mentorId' });

  const existing = db.prepare('SELECT mentorId FROM mentor_profiles WHERE mentorId = ?').get(mentorId);
  if (existing) {
    db.prepare(`UPDATE mentor_profiles SET bio=?, location=?, languages=?, subjects=?, responseRate=?, online=? WHERE mentorId=?`)
      .run(bio, location, JSON.stringify(languages || ['English']), JSON.stringify(subjects || ['General']), responseRate || 85, online ? 1 : 0, mentorId);
  } else {
    db.prepare(`INSERT INTO mentor_profiles (mentorId, bio, location, languages, subjects, responseRate, online) VALUES (?,?,?,?,?,?,?)`)
      .run(mentorId, bio || 'Expert mentor on BridgeMinds.', location || 'Global', JSON.stringify(languages || ['English']), JSON.stringify(subjects || ['General']), responseRate || 85, online ? 1 : 0);
  }
  res.json({ success: true });
});

module.exports = router;
