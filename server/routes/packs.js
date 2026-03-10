const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

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
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const { title, subject, grade } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const id = 'pack-' + Date.now();
    const sizeMb = (req.file.size / (1024 * 1024)).toFixed(1) + 'MB';
    const filePath = '/uploads/' + req.file.filename;

    db.prepare(`
      INSERT INTO packs (id, title, subject, grade, size, lessons, filePath, createdAt)
      VALUES (@id, @title, @subject, @grade, @size, @lessons, @filePath, @createdAt)
    `).run({
      id,
      title: title || 'Untitled Pack',
      subject: subject || 'General',
      grade: grade || 'All Grades',
      size: sizeMb,
      lessons: 1,
      filePath,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, packId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload pack' });
  }
});

router.get('/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const packs = db.prepare('SELECT * FROM packs ORDER BY createdAt DESC').all();

    // Get downloads for student
    const downloads = db.prepare('SELECT * FROM student_downloads WHERE studentId = ?').all(studentId);
    const downloadedPackIds = new Set(downloads.map(d => d.packId));

    const result = packs.map(p => {
      const isDownloaded = downloadedPackIds.has(p.id);
      const downloadRecord = downloads.find(d => d.packId === p.id);
      return {
        ...p,
        downloaded: isDownloaded,
        progress: isDownloaded ? (downloadRecord.progress || 100) : 0
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:studentId/download', (req, res) => {
  try {
    const { studentId } = req.params;
    const { packId } = req.body;

    db.prepare(`
      INSERT OR IGNORE INTO student_downloads (studentId, packId, progress, downloadedAt)
      VALUES (@studentId, @packId, @progress, @downloadedAt)
    `).run({
      studentId: studentId,
      packId: packId,
      progress: 100, // mock completion
      downloadedAt: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log download' });
  }
});

module.exports = router;
