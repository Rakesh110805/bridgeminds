const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// In-memory data store for questions
const questionsDb = [];

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { text, sourceLang, studentId, subject } = req.body;
    let transcribedText = text;

    // 1. Audio Processing (Mock Whisper)
    if (req.file) {
      console.log('Received audio blob, mocking Whisper API...');
      await new Promise(r => setTimeout(r, 1500));
      transcribedText = "Python-ல் loops எப்படி use பண்றது?";
    }

    if (!transcribedText) {
      return res.status(400).json({ message: 'No text or audio provided' });
    }

    // 2. Translation (Mock Google Translate)
    console.log(`Translating from ${sourceLang} to English...`);
    await new Promise(r => setTimeout(r, 1000));
    const translatedText = "How do I use loops in Python?";

    // 3. Save Question Structure
    const question = {
      id: Date.now().toString(),
      studentId: studentId || 'demo-123',
      subject: subject || 'Computer Science',
      original: transcribedText,
      translated: translatedText,
      sourceLang: sourceLang || 'Tamil',
      status: 'queued_for_mentor',
      aiReply: null,
      createdAt: new Date().toISOString()
    };
    
    questionsDb.push(question);

    // 4. AI Tutor Instant Reply (Mock Claude)
    console.log('Fetching instant Claude reply...');
    await new Promise(r => setTimeout(r, 2000));
    const aiReplyEnglish = `A loop is like doing chores — if you need to water 10 plants, instead of going one by one and coming back, you make one round trip. In Python, you can write: \n\nfor i in range(10):\n    water_plant()`;
    
    // Translate AI back to Source Lang
    const aiReplyTranslated = "ஒரு loop என்பது வீட்டு வேலைகள் செய்வது போன்றது — நீங்கள் 10 செடிகளுக்கு தண்ணீர் ஊற்றினால், நீங்கள் 10 முறை சென்று வர வேண்டாம், ஒரே பயணத்தில் ஊற்றலாம். Python-ல்: \nfor i in range(10):\n    water_plant()";

    question.aiReply = {
      originalTranslated: aiReplyTranslated,
      english: aiReplyEnglish
    };

    res.json({
      questionId: question.id,
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
  const studentQs = questionsDb.filter(q => q.studentId === req.params.id);
  res.json(studentQs);
});

router.get('/pending', (req, res) => {
  // Returns all pending questions for mentors
  res.json(questionsDb);
});

module.exports = router;
module.exports.questionsDb = questionsDb;
