const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// WAL mode for performance
db.pragma('journal_mode = WAL');

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      subject TEXT NOT NULL,
      original TEXT NOT NULL,
      translated TEXT NOT NULL,
      sourceLang TEXT NOT NULL,
      status TEXT NOT NULL,
      aiReply JSON,
      audioPath TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      questionId TEXT NOT NULL,
      mentorId TEXT NOT NULL,
      english TEXT NOT NULL,
      translated TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (questionId) REFERENCES questions(id),
      FOREIGN KEY (mentorId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade TEXT,
      size TEXT,
      lessons INTEGER,
      filePath TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_downloads (
      studentId TEXT NOT NULL,
      packId TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      downloadedAt TEXT NOT NULL,
      PRIMARY KEY (studentId, packId),
      FOREIGN KEY (studentId) REFERENCES users(id),
      FOREIGN KEY (packId) REFERENCES packs(id)
    );

    CREATE TABLE IF NOT EXISTS faq_cache (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      questionKeywords TEXT NOT NULL,
      englishAnswer TEXT NOT NULL,
      frequency INTEGER DEFAULT 1,
      lastUsed TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mentor_settings (
      mentorId TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      notifications BOOLEAN DEFAULT 1,
      autoTranslate BOOLEAN DEFAULT 1,
      timezone TEXT,
      maxStudents INTEGER DEFAULT 5,
      subjects TEXT,
      languages TEXT,
      FOREIGN KEY (mentorId) REFERENCES users(id)
    );
  `);

  // Seed demo student account if not present
  const existing = db.prepare("SELECT id FROM users WHERE email = 'priya@demo.com'").get();
  if (!existing) {
    db.prepare("INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?,?,?,?,?)")
      .run('demo-123', 'Priya Sharma', 'priya@demo.com', 'demo123', 'STUDENT');
  }
};

initDb();

// Safe schema migration: add missing columns to existing tables
const runMigrations = () => {
  const existingCols = db.prepare('PRAGMA table_info(questions)').all().map(c => c.name);
  if (!existingCols.includes('audioPath')) {
    db.exec('ALTER TABLE questions ADD COLUMN audioPath TEXT');
    console.log('[DB Migration] Added audioPath to questions');
  }
  const replysCols = db.prepare('PRAGMA table_info(replies)').all().map(c => c.name);
  if (!replysCols.includes('translated')) {
    db.exec('ALTER TABLE replies ADD COLUMN translated TEXT DEFAULT ""');
    console.log('[DB Migration] Added translated to replies');
  }
};
runMigrations();

module.exports = db;
