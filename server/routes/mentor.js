const express = require('express');
const router = express.Router();
const db = require('../db');
const { translateText } = require('./translate');

router.post('/reply', async (req, res) => {
  const { mentorReply, translatedReply, questionId, mentorId } = req.body;

  if (!mentorReply || !questionId) {
    return res.status(400).json({ error: 'Missing reply or questionId' });
  }

  const question = db.prepare('SELECT sourceLang, studentId FROM questions WHERE id = ?').get(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Use client-pre-translated text if available, otherwise try server-side translation
  let translatedBack = translatedReply || mentorReply;
  if (!translatedReply && question.sourceLang && question.sourceLang !== 'English') {
    translatedBack = await translateText(mentorReply, question.sourceLang);
  }

  const replyId = 'rep_' + Date.now().toString();
  db.prepare(`
    INSERT INTO replies (id, questionId, mentorId, english, translated, createdAt)
    VALUES (@id, @questionId, @mentorId, @english, @translated, @createdAt)
  `).run({
    id: replyId,
    questionId,
    mentorId: mentorId || 'mentor-demo',
    english: mentorReply,
    translated: translatedBack,
    createdAt: new Date().toISOString()
  });

  db.prepare("UPDATE questions SET status = 'answered' WHERE id = ?").run(questionId);

  // Emit to student room if io is available
  if (req.app.get('io')) {
    const io = req.app.get('io');
    io.to(`student-${question.studentId}`).emit('new-message', {
      id: replyId,
      sender: 'mentor',
      text: mentorReply,
      translated: translatedBack,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionId
    });
  }

  res.json({ success: true, replyId, translated: translatedBack });
});

router.get('/question/:questionId', (req, res) => {
  const replies = db.prepare("SELECT r.*, u.name as mentorName FROM replies r JOIN users u ON r.mentorId = u.id WHERE r.questionId = ? ORDER BY r.createdAt ASC").all(req.params.questionId);
  res.json(replies);
});

router.get('/stats/:mentorId', (req, res) => {
  try {
    const { mentorId } = req.params;
    const activeStudentsRow = db.prepare('SELECT COUNT(DISTINCT studentId) as count FROM questions').get();
    const pendingQuestionsRow = db.prepare("SELECT COUNT(*) as count FROM questions WHERE status = 'queued_for_mentor'").get();
    const mentorRepliesCount = db.prepare("SELECT COUNT(*) as count FROM replies WHERE mentorId = ?").get(mentorId).count;
    const impactScore = Math.min(10, (mentorRepliesCount * 0.5) + 5).toFixed(1);
    res.json({ activeStudents: activeStudentsRow.count, pendingQuestions: pendingQuestionsRow.count, impactScore, mentorReplies: mentorRepliesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/students/:mentorId', (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.name, u.email,
        COUNT(q.id) as questionsCount,
        MAX(q.createdAt) as lastActive,
        GROUP_CONCAT(DISTINCT q.subject) as subjects,
        MAX(q.sourceLang) as language
      FROM users u
      LEFT JOIN questions q ON u.id = q.studentId
      WHERE u.role = 'STUDENT'
      GROUP BY u.id
    `).all();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics endpoint
router.get('/analytics/:mentorId', (req, res) => {
  try {
    // Questions over last 14 days
    const questionsOverTime = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const row = db.prepare(`SELECT COUNT(*) as count FROM questions WHERE date(createdAt) = ?`).get(dateStr);
      questionsOverTime.push({ date: label, count: row.count });
    }

    // By subject
    const bySubject = db.prepare(`SELECT subject, COUNT(*) as count FROM questions GROUP BY subject ORDER BY count DESC`).all();

    // By language
    const langTotal = db.prepare(`SELECT COUNT(*) as total FROM questions`).get().total || 1;
    const byLanguage = db.prepare(`SELECT sourceLang as language, COUNT(*) as count FROM questions GROUP BY sourceLang ORDER BY count DESC`).all()
      .map(r => ({ ...r, percentage: Math.round((r.count / langTotal) * 100) }));

    // Response time avg (hours between question and first reply)
    const avgRow = db.prepare(`
      SELECT AVG((julianday(r.createdAt) - julianday(q.createdAt)) * 24) as avgHours
      FROM replies r JOIN questions q ON r.questionId = q.id
    `).get();

    const totalStudentsHelped = db.prepare(`SELECT COUNT(DISTINCT studentId) as count FROM questions WHERE status = 'answered'`).get().count;
    const repliesSent = db.prepare(`SELECT COUNT(*) as count FROM replies WHERE mentorId = ?`).get(req.params.mentorId).count;

    res.json({
      questionsOverTime,
      bySubject,
      byLanguage,
      avgResponseHours: avgRow.avgHours ? parseFloat(avgRow.avgHours.toFixed(1)) : 0,
      totalStudentsHelped,
      repliesSent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analytics error' });
  }
});

// Live translation preview endpoint
router.get('/preview-translate', async (req, res) => {
  try {
    const { text, targetLang } = req.query;
    if (!text || !targetLang) return res.json({ translation: '' });
    const translation = await translateText(text, targetLang);
    res.json({ translation });
  } catch (err) {
    res.json({ translation: '' });
  }
});

// Settings
router.get('/settings/:mentorId', (req, res) => {
  const settings = db.prepare('SELECT * FROM mentor_settings WHERE mentorId = ?').get(req.params.mentorId);
  res.json(settings || {});
});

router.put('/settings/:mentorId', (req, res) => {
  try {
    const { mentorId } = req.params;
    const { email, notifications, autoTranslate, timezone, maxStudents, subjects, languages } = req.body;
    const existing = db.prepare('SELECT mentorId FROM mentor_settings WHERE mentorId = ?').get(mentorId);
    if (existing) {
      db.prepare(`UPDATE mentor_settings SET email=?, notifications=?, autoTranslate=?, timezone=?, maxStudents=?, subjects=?, languages=? WHERE mentorId=?`)
        .run(email, notifications ? 1 : 0, autoTranslate ? 1 : 0, timezone, maxStudents, JSON.stringify(subjects), JSON.stringify(languages), mentorId);
    } else {
      db.prepare(`INSERT INTO mentor_settings (mentorId, email, notifications, autoTranslate, timezone, maxStudents, subjects, languages) VALUES (?,?,?,?,?,?,?,?)`)
        .run(mentorId, email, notifications ? 1 : 0, autoTranslate ? 1 : 0, timezone, maxStudents, JSON.stringify(subjects), JSON.stringify(languages));
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Settings save failed' });
  }
});

module.exports = router;
