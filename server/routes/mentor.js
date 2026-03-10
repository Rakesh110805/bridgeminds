const express = require('express');
const router = express.Router();

// Reference the questions simulated database
const { questionsDb } = require('./ask');

// In memory mentor replies
const repliesDb = [];

router.post('/reply', async (req, res) => {
  const { mentorReply, questionId, mentorId } = req.body;

  if (!mentorReply || !questionId) {
    return res.status(400).json({ error: 'Missing reply or questionId' });
  }

  const question = questionsDb.find(q => q.id === questionId);
  if (!question) {
    // If we're demoing with a hardcoded question ID that doesn't exist yet
    return res.status(404).json({ error: 'Question not found' });
  }

  // Translate Mentor's English reply to Student's Language (Mock)
  console.log(`Translating mentor reply from English to ${question.sourceLang}...`);
  await new Promise(r => setTimeout(r, 1200));

  const translatedBack = mentorReply + " (Translated to " + question.sourceLang + ")";

  const reply = {
    id: Date.now().toString(),
    questionId,
    mentorId: mentorId || 'mentor-demo',
    english: mentorReply,
    translated: translatedBack,
    createdAt: new Date().toISOString()
  };

  repliesDb.push(reply);
  question.status = 'answered';

  res.json({ success: true, reply });
});

router.get('/question/:questionId', (req, res) => {
  const replies = repliesDb.filter(r => r.questionId === req.params.questionId);
  res.json(replies);
});

module.exports = router;
