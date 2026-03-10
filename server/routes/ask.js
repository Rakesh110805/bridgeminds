const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { translateText, translateToEnglish } = require('./translate');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.webm')
});
const upload = multer({ storage });

// Gemini AI - lazily initialized
let genAI = null;
function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// ─── Conversational Smart AI (works offline, no API key needed) ────────────────

// Casual / social message detector — responds naturally instead of as a tutor
const CASUAL_PATTERNS = [
  { words: ['hiii', 'hiiii', 'hii', 'hi', 'hello', 'hey', 'sup', 'yo'], reply: "Hey! 👋 I'm your AI tutor, ready to help anytime. What are you studying today? Just ask me anything — maths, science, computers, career, anything at all!" },
  { words: ['how are you', 'how r u', 'how are u', 'how ru'], reply: "Doing great, thanks! 😄 Ready to help you learn something new. What's on your mind — a topic you're stuck on or something you're curious about?" },
  { words: ['thank you', 'thank u', 'thanks', 'thnks', 'tq', 'ty', 'thx'], reply: "You're very welcome! 🌟 Keep that curiosity alive — every question you ask is a step forward. What else can I help you with?" },
  { words: ['bye', 'goodbye', 'good bye', 'see you', 'cya', 'see u'], reply: "See you! 👋 Come back anytime — I'm always here. Keep practising a little every day, it adds up faster than you think!" },
  { words: ['ok', 'okay', 'got it', 'i see', 'understood', 'alright', 'cool', 'nice'], reply: "Great! If anything is still unclear, just ask me in a different way. Sometimes a different angle makes everything click. 😊" },
  { words: ['have a doubt', 'have doubt', 'i have a doubt', 'doubt', 'need help', 'can you help', 'please help', 'help me'], reply: "Of course, I'm here! 📚 Go ahead and type your question — what topic or concept are you confused about? No question is too basic, promise!" },
  { words: ['what is your name', 'who are you', 'who r u', 'who ru'], reply: "I'm the BridgeMinds AI Tutor — your 24/7 study buddy! 🤖 I can help with maths, science, computers, English, and career advice. What would you like to explore?" },
  { words: ['good morning', 'good evening', 'good afternoon', 'good night'], reply: "Good day! 🌅 A great time to learn something new. What subject are you working on today? I'm ready whenever you are." },
  { words: ['test', 'testing', 'hello world'], reply: "I'm here and working! 😊 Go ahead and ask me a real question — I'll do my best to explain it clearly. What are you curious about?" },
];

// Subject-specific knowledge with natural, conversational answers (NO numbered lists)
const KNOWLEDGE_BASE = {
  'Computer Science': [
    {
      patterns: ['install', 'setup', 'operating system', 'os', 'ubuntu', 'linux', 'windows'],
      answer: "Installing an OS is simpler than it sounds! You need a USB drive with the OS image on it. When you restart your computer, press F2 or F12 to choose to boot from the USB instead of your hard drive, then the installer guides you through everything step by step. Ubuntu Linux is my top recommendation if you're starting out — it's completely free, runs well even on older machines, and has a massive online community ready to help if you get stuck."
    },
    {
      patterns: ['algorithm', 'sort', 'bubble sort', 'searching', 'binary search'],
      answer: "An algorithm is basically a recipe — a clear set of steps to solve a problem. Bubble Sort, for example, goes through a list of numbers comparing each pair and swapping them if they're in the wrong order, repeating until everything is sorted. It's not the fastest method, but it's the easiest to understand first. Try it yourself with a shuffled deck of cards — it really clicks when you do it with your hands!"
    },
    {
      patterns: ['python', 'java', 'javascript', 'programming', 'code', 'coding', 'variable', 'loop', 'function', 'array'],
      answer: "Programming is just giving a computer very precise instructions. In Python, `name = 'Priya'` stores a value and `print(name)` displays it — almost reads like plain English! The most important thing is to write code every single day, even if it's just a few lines. Start with something you'd actually use, like a program that calculates your test average or converts temperatures."
    },
    {
      patterns: ['internet', 'network', 'tcp', 'ip', 'router', 'wifi', 'protocol', 'connection'],
      answer: "The internet is essentially a massive postal system for data. When you load a website, your request gets broken into small 'packets', each labeled with your address and the destination. These packets travel through many routers across the world to reach the server, which sends the webpage back the same way. If your connection drops, start by restarting the router — that fixes most common issues right away."
    },
    {
      patterns: ['database', 'sql', 'table', 'query', 'select', 'data storage'],
      answer: "A database is organized storage for information — think of it as a super-powered spreadsheet. SQL is the language you use to ask it questions. Something like `SELECT * FROM students WHERE score > 80` retrieves all students who scored above 80. It reads almost like plain English once you get used to it! SQLite Browser is a free tool where you can create tables and run queries to practice."
    },
    {
      patterns: ['binary', 'bits', 'bytes', 'decimal', 'hexadecimal', 'number system'],
      answer: "Computers use binary — only 0s and 1s — because every circuit inside them has just two states: off (0) or on (1). The number 5 in binary is 101, which means 1×4 + 0×2 + 1×1. To convert a number to binary, divide by 2 repeatedly and read the remainders from bottom to top. Try converting your age to binary — it's a satisfying little puzzle to figure out!"
    },
  ],
  'Math': [
    {
      patterns: ['fraction', 'numerator', 'denominator', 'add fraction', 'subtract fraction', 'divide fraction'],
      answer: "Fractions represent parts of a whole — 3/8 means 3 out of 8 equal parts. To add them you need the same denominator first, so 1/3 + 1/4 becomes 4/12 + 3/12 = 7/12. For dividing, just flip the second fraction and multiply: 2/3 ÷ 1/4 = 2/3 × 4 = 8/3. A good way to make it real: cut a piece of paper into equal pieces and physically combine them."
    },
    {
      patterns: ['algebra', 'equation', 'solve for', 'variable', 'linear', 'quadratic', 'unknown'],
      answer: "Algebra is about finding missing values. Think of every equation as a perfectly balanced scale — whatever you do to one side, you must do to the other to keep the balance. So if x + 7 = 15, subtract 7 from both sides to get x = 8. Work one step at a time, and isolate the variable. Practice with real scenarios like 'If I save ₹x per week, how many weeks to save ₹500?'"
    },
    {
      patterns: ['percentage', 'percent', 'discount', 'interest', 'profit', 'loss'],
      answer: "Percentages are just fractions out of 100. To find 30% of 200, multiply: 200 × 0.30 = 60. For a 20% discount on something costing ₹800, that's ₹800 × 0.20 = ₹160 off, so you pay ₹640. You can practise this whenever you go shopping — calculate the discount in your head before you reach the counter. Great real-world skill!"
    },
    {
      patterns: ['area', 'perimeter', 'geometry', 'circle', 'triangle', 'rectangle', 'volume'],
      answer: "Area is the space inside a shape and perimeter is the total distance around its edge. For a rectangle: Area = length × width, Perimeter = 2(length + width). For a circle: Area = π×r² and circumference = 2πr. A practical way to understand this: measure your room, calculate the floor area, then figure out how many tiles you'd need to cover it — it makes the formula mean something real."
    },
    {
      patterns: ['probability', 'chance', 'likely', 'random', 'outcome'],
      answer: "Probability measures how likely something is, on a scale from 0 (impossible) to 1 (certain). The formula is: P = (ways the event can happen) ÷ (total possible outcomes). A coin flip: P(heads) = 1/2 = 50%. Toss a real coin 20 times and track your results — you'll see how the experimental outcome gets closer to 50/50 the more flips you do."
    },
    {
      patterns: ['mean', 'median', 'mode', 'average', 'statistics'],
      answer: "These three values each describe the centre of a dataset differently. Mean is the sum divided by the count. Median is the exact middle value when sorted. Mode is the most frequently occurring value. With scores [60, 72, 72, 85, 91]: Mean=76, Median=72, Mode=72. Try calculating these for your recent test scores — it gives you a quick picture of how you're doing overall."
    },
  ],
  'Science': [
    {
      patterns: ['photosynthesis', 'plant', 'chlorophyll', 'leaf', 'sunlight', 'oxygen'],
      answer: "Photosynthesis is how plants make their own food. The formula is: CO₂ + H₂O + sunlight → glucose + O₂. Leaves are solar-powered food factories — the green colour comes from chlorophyll, which captures light energy to drive this reaction. You can actually watch it happen: put a healthy leaf in a glass of water in direct sunlight and look for tiny bubbles of oxygen forming on the leaf surface within about an hour."
    },
    {
      patterns: ['gravity', 'force', 'newton', 'motion', 'acceleration', 'velocity', 'speed'],
      answer: "Gravity pulls all objects toward Earth's centre at 9.8 m/s² — so a falling object speeds up by about 10 m/s for every second it falls. Newton's second law says Force = mass × acceleration, which is why pushing a loaded cart takes so much more effort than an empty one. A cool experiment: drop two objects of very different weights from the same height at the same moment — they land at the same time!"
    },
    {
      patterns: ['atom', 'molecule', 'element', 'compound', 'periodic table', 'electron', 'proton'],
      answer: "Everything around you is made of atoms — incredibly tiny structures with a nucleus at the centre containing protons (positive) and neutrons (neutral), with electrons orbiting around the outside. Elements are substances made of only one type of atom, like iron or oxygen. When atoms bond together they form molecules — water is H₂O, literally just two hydrogen atoms bonded to one oxygen atom."
    },
    {
      patterns: ['cell', 'biology', 'nucleus', 'membrane', 'mitochondria', 'organism'],
      answer: "Cells are the fundamental building blocks of all life — your body contains about 37 trillion of them! The nucleus is the control centre, holding all the DNA instructions. Mitochondria generate energy from food. The cell membrane acts as a flexible outer boundary controlling what enters and exits. To visualise it, think of a bag (membrane) containing water (cytoplasm) with a smaller bag inside (nucleus)."
    },
    {
      patterns: ['acid', 'base', 'ph', 'chemical reaction', 'catalyst'],
      answer: "The pH scale tells you how acidic or basic a solution is, running from 0 to 14. Below 7 is acidic (lemon juice ~2, vinegar ~3), exactly 7 is neutral like pure water, and above 7 is basic (baking soda ~9). You can make your own pH indicator: boil red cabbage, collect the purple juice, and add drops of it to different liquids — it turns pink in acids and green in bases. Home chemistry!"
    },
  ],
  'English': [
    {
      patterns: ['grammar', 'tense', 'verb', 'noun', 'adjective', 'sentence', 'subject'],
      answer: "Every complete sentence needs at least a subject (who or what it's about) and a verb (what they're doing). 'The student reads' is complete; 'The student' alone is not — it's missing the action. For tenses: present = happening now ('I eat'), past = already happened ('I ate'), future = will happen ('I will eat'). Practise by writing about your day in all three tenses — it becomes muscle memory quickly."
    },
    {
      patterns: ['essay', 'write', 'paragraph', 'introduction', 'conclusion', 'structure'],
      answer: "Think of an essay like a sandwich — the bread is your introduction and conclusion, and the filling is your arguments. Your introduction should end with a clear thesis (your main point). Each body paragraph starts with a topic sentence supporting your thesis, then provides evidence and an example. Your conclusion restates the argument and explains why it matters. Write your thesis first — everything else flows naturally from it."
    },
    {
      patterns: ['vocabulary', 'word', 'meaning', 'synonym', 'prefix', 'suffix', 'root'],
      answer: "The most effective way to build vocabulary is to learn words in real context, not from isolated lists. When you meet an unfamiliar word, first guess its meaning from the sentence around it, then confirm with a dictionary. Write your own sentence using it about something from YOUR life — the personal connection makes it stick. Learning roots is powerful: 'port' means carry, so transport, import, export, portable all become familiar at once."
    },
    {
      patterns: ['comprehension', 'reading', 'passage', 'inference', 'main idea'],
      answer: "For comprehension, read the passage twice — first quickly to get the gist, then slowly while underlining key ideas. Inference questions are tricky because the answer is implied but never stated directly — look for evidence in the text that supports your answer. For 'main idea' questions, the answer is usually in the first or last paragraph. Underline as you read; it keeps your mind active and focused."
    },
  ],
  'Career': [
    {
      patterns: ['job', 'career', 'profession', 'work', 'future', 'employment'],
      answer: "The best career sits at the intersection of what you're good at, what you genuinely enjoy, and what people will pay for. Start by noticing which activities make you lose track of time — those reveal natural strengths. Then research which careers value those strengths. Most importantly, talk to real people working in fields that interest you — actual conversations reveal what job listings never show you."
    },
    {
      patterns: ['resume', 'cv', 'interview', 'application', 'cover letter'],
      answer: "Interviews reward people who sound natural and prepared, not memorised. Prepare 2-3 stories using the STAR format: Situation, Task, Action, Result. Practice saying them out loud until they feel conversational. Before any interview, spend 10 minutes reading about the organisation — knowing their mission and recent work signals genuine interest, and interviewers notice."
    },
    {
      patterns: ['skill', 'learn', 'course', 'certificate', 'training'],
      answer: "The most valuable skills right now are critical thinking, clear communication, and at least one technical skill relevant to your field. Free resources like Khan Academy, Coursera, and YouTube have excellent material. The key insight is this: completing one course deeply is worth more than starting ten. After you finish, build something real using what you learned — that's what actually cements the knowledge."
    },
  ],
};

function generateSmartFallback(question, subject) {
  const q = question.toLowerCase().trim();

  // 1. Handle casual / social messages first
  for (const casual of CASUAL_PATTERNS) {
    if (casual.words.some(w => q.includes(w) || q === w)) {
      return casual.reply;
    }
  }

  // 2. Very short messages (likely vague) — ask for clarification
  const wordCount = q.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 3 && !q.includes('?')) {
    return `Hmm, tell me a bit more! What specifically about "${question}" would you like to understand? The more detail you give me, the better I can explain it. 😊`;
  }

  // 3. Match against knowledge base by keyword scoring
  let bestMatch = null;
  let bestScore = 0;

  // Search in the matching subject first, then everywhere
  const searchOrder = [
    KNOWLEDGE_BASE[subject] || [],
    ...Object.values(KNOWLEDGE_BASE).filter(base => base !== KNOWLEDGE_BASE[subject])
  ].flat();

  for (const entry of searchOrder) {
    const score = entry.patterns.filter(p => q.includes(p)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  // 4. Last resort — conversational, not generic
  const keyWord = q.split(' ').filter(w => w.length > 4)[0] || question.split(' ')[0] || 'that';
  return `That's a really interesting question about ${keyWord}! I want to give you an accurate answer, and your mentor will respond with expert knowledge soon. While you wait, try this approach: what do you already know about the topic? Building from familiar ground is always the fastest path to understanding something new. If you rephrase or add more detail to your question, I might be able to help more right now! 😊`;
}
// ─────────────────────────────────────────────────────────────────────────────

async function getAIReply(translatedQuestion, sourceLang, subject) {
  // 1. Check FAQ cache first
  try {
    const faqCache = db.prepare(`
      SELECT questionKeywords, englishAnswer, frequency
      FROM faq_cache WHERE subject = ?
      ORDER BY frequency DESC LIMIT 10
    `).all(subject);

    const words = translatedQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const match = faqCache.find(faq => {
      const kwds = faq.questionKeywords.split(',');
      return kwds.filter(k => words.some(w => w.includes(k.trim()))).length >= 3;
    });
    if (match) {
      db.prepare(`UPDATE faq_cache SET frequency = frequency + 1, lastUsed = ? WHERE questionKeywords = ?`)
        .run(new Date().toISOString(), match.questionKeywords);
      return { english: match.englishAnswer, cached: true };
    }
  } catch (e) {
    console.error('FAQ cache lookup failed:', e.message);
  }

  // 2. Try Gemini AI if key is configured
  const ai = getGenAI();
  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `You are BridgeMind, a friendly AI tutor for rural students in developing countries.

Student asked (translated from ${sourceLang}): "${translatedQuestion}"
Subject: ${subject}

Reply like a warm, knowledgeable friend — NOT like a textbook. Use natural sentences. No bullet points or numbered lists. Keep it to 2-4 sentences. Include a real-world example if helpful. End with one concrete thing they can try or practice. Use simple vocabulary.`;
      const result = await model.generateContent(prompt);
      const english = result.response.text();
      const keywords = translatedQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 8).join(',');
      if (keywords) {
        try {
          db.prepare(`INSERT OR IGNORE INTO faq_cache (id, subject, questionKeywords, englishAnswer, frequency, lastUsed) VALUES (?,?,?,?,1,?)`)
            .run('faq_' + Date.now(), subject, keywords, english, new Date().toISOString());
        } catch (e) { /* ignore */ }
      }
      return { english, cached: false };
    } catch (e) {
      console.error('Gemini API error:', e.message);
    }
  }

  // 3. Smart local fallback
  return { english: generateSmartFallback(translatedQuestion, subject), cached: false };
}

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { text, sourceLang, studentId, subject, translatedText: clientTranslated } = req.body;
    let transcribedText = text;
    let audioPath = req.file ? '/uploads/' + req.file.filename : null;

    if (!transcribedText) {
      return res.status(400).json({ message: 'No text provided' });
    }

    let translatedText = clientTranslated || transcribedText;
    if (!clientTranslated && sourceLang && sourceLang !== 'English') {
      translatedText = await translateToEnglish(transcribedText, sourceLang) || transcribedText;
    }

    const { english: aiReplyEnglish, cached } = await getAIReply(translatedText, sourceLang || 'English', subject || 'General');
    const aiReplyJson = JSON.stringify({ english: aiReplyEnglish });

    const questionId = 'q_' + Date.now().toString();
    db.prepare(`
      INSERT INTO questions (id, studentId, subject, original, translated, sourceLang, status, aiReply, audioPath, createdAt)
      VALUES (@id, @studentId, @subject, @original, @translated, @sourceLang, @status, @aiReply, @audioPath, @createdAt)
    `).run({
      id: questionId,
      studentId: studentId || 'demo-123',
      subject: subject || 'Computer Science',
      original: transcribedText,
      translated: translatedText,
      sourceLang: sourceLang || 'Tamil',
      status: 'queued_for_mentor',
      aiReply: aiReplyJson,
      audioPath,
      createdAt: new Date().toISOString()
    });

    res.json({
      questionId,
      aiReply: aiReplyEnglish,
      originalTranslated: translatedText,
      transcribedText,
      status: 'queued_for_mentor',
      cached: cached || false
    });

  } catch (error) {
    console.error('Ask API Error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

router.get('/student/:id', (req, res) => {
  const studentQs = db.prepare('SELECT * FROM questions WHERE studentId = ? ORDER BY createdAt DESC').all(req.params.id);
  const parsed = studentQs.map(q => ({ ...q, aiReply: q.aiReply ? JSON.parse(q.aiReply) : null }));
  res.json(parsed);
});

router.get('/pending', (req, res) => {
  const pendingQs = db.prepare("SELECT q.*, u.name as studentName FROM questions q JOIN users u ON q.studentId = u.id WHERE q.status = 'queued_for_mentor' ORDER BY q.createdAt ASC").all();
  res.json(pendingQs);
});

router.get('/faq/:subject', (req, res) => {
  const faqs = db.prepare(`SELECT questionKeywords as keywords, englishAnswer as answer, frequency FROM faq_cache WHERE subject = ? ORDER BY frequency DESC LIMIT 5`).all(req.params.subject);
  res.json(faqs);
});

module.exports = router;
