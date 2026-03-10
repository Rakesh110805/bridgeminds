const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/reply', async (req, res) => {
  const { mentorReply, questionId, mentorId } = req.body;

  if (!mentorReply || !questionId) {
    return res.status(400).json({ error: 'Missing reply or questionId' });
  }

  const question = db.prepare('SELECT sourceLang FROM questions WHERE id = ?').get(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Translate Mentor's English reply to Student's Language
  let translatedBack = mentorReply + " (Translation failed)";
  try {
    const langCodeMap = { 'Tamil': 'ta', 'Hindi': 'hi', 'Spanish': 'es', 'English': 'en', 'French': 'fr', 'Swahili': 'sw' };
    const tc = langCodeMap[question.sourceLang] || 'ta';
    const backTrans = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(mentorReply)}&langpair=en|${tc}`);
    const resultBack = await backTrans.json();
    if (resultBack.responseData && resultBack.responseData.translatedText) {
      translatedBack = resultBack.responseData.translatedText;
    }
  } catch (e) {
    console.error("Back translation API failed", e);
  }

  const replyId = 'rep_' + Date.now().toString();

  // Insert reply
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

  // Update question status
  db.prepare("UPDATE questions SET status = 'answered' WHERE id = ?").run(questionId);

  res.json({ success: true, replyId });
});

router.get('/question/:questionId', (req, res) => {
  const replies = db.prepare("SELECT * FROM replies WHERE questionId = ? ORDER BY createdAt ASC").all(req.params.questionId);
  res.json(replies);
});

router.get('/stats/:mentorId', (req, res) => {
  try {
    const { mentorId } = req.params;

    // Active Students: count distinct studentId from questions
    const activeStudentsRow = db.prepare('SELECT COUNT(DISTINCT studentId) as count FROM questions').get();

    // Pending Questions
    const pendingQuestionsRow = db.prepare("SELECT COUNT(*) as count FROM questions WHERE status = 'queued_for_mentor'").get();

    // Impact score based on answers given
    const mentorRepliesCount = db.prepare("SELECT COUNT(*) as count FROM replies WHERE mentorId = ?").get(mentorId).count;
    const impactScore = Math.min(10, (mentorRepliesCount * 0.5) + 5).toFixed(1);

    res.json({
      activeStudents: activeStudentsRow.count,
      pendingQuestions: pendingQuestionsRow.count,
      impactScore: impactScore,
      mentorReplies: mentorRepliesCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/students/:mentorId', (req, res) => {
  try {
    // Return all students that have asked questions
    const questions = db.prepare('SELECT * FROM questions ORDER BY createdAt DESC').all();

    const uniqueStudentsMap = {};
    questions.forEach(q => {
      if (!uniqueStudentsMap[q.studentId]) {
        uniqueStudentsMap[q.studentId] = {
          id: q.studentId,
          name: q.studentId === 'demo-123' ? 'Demo Student' : q.studentId,
          questionsCount: 0,
          lastActive: new Date(q.createdAt).toLocaleDateString(),
          subject: q.subject
        };
      }
      uniqueStudentsMap[q.studentId].questionsCount += 1;
      // update last active if it's newer
      const qDate = new Date(q.createdAt);
      const sDate = new Date(uniqueStudentsMap[q.studentId].lastActive);
      if (qDate > sDate) {
        uniqueStudentsMap[q.studentId].lastActive = qDate.toLocaleDateString();
      }
    });

    res.json(Object.values(uniqueStudentsMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
