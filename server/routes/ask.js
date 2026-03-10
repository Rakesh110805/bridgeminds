const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db'); // import SQLite db

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.webm')
  }
})

const upload = multer({ storage: storage });

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { text, sourceLang, studentId, subject } = req.body;
    let transcribedText = text;
    let audioPath = null;

    if (req.file) {
      audioPath = '/uploads/' + req.file.filename;
    }

    if (!transcribedText) {
      return res.status(400).json({ message: 'No text provided' });
    }

    // Execute translations in parallel to dramatically cut latency
    let translatedText = transcribedText; // Fallback
    let aiReplyTranslated = aiReplyEnglish; // Fallback

    try {
      const langCodeMap = { 'Tamil': 'ta', 'Hindi': 'hi', 'Spanish': 'es', 'English': 'en', 'French': 'fr', 'Swahili': 'sw' };
      const tc = langCodeMap[sourceLang] || 'ta';

      const [transToEnglishRes, transToNativeRes] = await Promise.all([
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(transcribedText)}&langpair=${tc}|en`),
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(aiReplyEnglish)}&langpair=en|${tc}`)
      ]);

      const [englishJson, nativeJson] = await Promise.all([
        transToEnglishRes.json(),
        transToNativeRes.json()
      ]);

      if (englishJson.responseData?.translatedText) {
        translatedText = englishJson.responseData.translatedText;
      }
      if (nativeJson.responseData?.translatedText) {
        aiReplyTranslated = nativeJson.responseData.translatedText;
      }
    } catch (e) {
      console.error("Parallel translation API failed", e);
    }

    const aiReplyJson = JSON.stringify({
      originalTranslated: aiReplyTranslated,
      english: aiReplyEnglish
    });

    const questionId = 'q_' + Date.now().toString();

    // 4. Save Question to DB
    const insert = db.prepare(`
        INSERT INTO questions (id, studentId, subject, original, translated, sourceLang, status, aiReply, audioPath, createdAt)
        VALUES (@id, @studentId, @subject, @original, @translated, @sourceLang, @status, @aiReply, @audioPath, @createdAt)
    `);

    insert.run({
      id: questionId,
      studentId: studentId || 'demo-123',
      subject: subject || 'Computer Science',
      original: transcribedText,
      translated: translatedText,
      sourceLang: sourceLang || 'Tamil',
      status: 'queued_for_mentor',
      aiReply: aiReplyJson,
      audioPath: audioPath,
      createdAt: new Date().toISOString()
    });

    res.json({
      questionId: questionId,
      aiReply: aiReplyTranslated,
      originalTranslated: translatedText,
      transcribedText,
      status: 'queued_for_mentor'
    });

  } catch (error) {
    console.error('Ask API Error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

router.get('/student/:id', (req, res) => {
  // Returns all questions for a student
  const studentQs = db.prepare('SELECT * FROM questions WHERE studentId = ? ORDER BY createdAt DESC').all(req.params.id);
  // Parse aiReply back to object for the frontend
  const parsed = studentQs.map(q => ({ ...q, aiReply: q.aiReply ? JSON.parse(q.aiReply) : null }));
  res.json(parsed);
});

router.get('/pending', (req, res) => {
  // Returns all pending questions for mentors
  const pendingQs = db.prepare("SELECT * FROM questions WHERE status = 'queued_for_mentor' ORDER BY createdAt ASC").all();
  res.json(pendingQs);
});

module.exports = router;
