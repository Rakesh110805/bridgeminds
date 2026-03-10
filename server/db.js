const Database = require('better-sqlite3');
const path = require('path');

// Initialize the database in the server directory
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Enable PRAGMA foreign_keys
db.pragma('journal_mode = WAL');

// Define Schema
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
  `);
};

initDb();

module.exports = db;
