const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard/:studentId', (req, res) => {
    try {
        const { studentId } = req.params;

        // 1. Questions Count
        const questionsRow = db.prepare('SELECT COUNT(*) as count FROM questions WHERE studentId = ?').get(studentId);

        // 2. Packs Finished (Mocked dynamically based on downloads or random logic, let's just count their downloads)
        const packsRow = db.prepare('SELECT COUNT(*) as count FROM student_downloads WHERE studentId = ? AND progress = 100').get(studentId);

        // 3. Streak (Number of active distinct days a student has asked a question)
        const distinctDaysRow = db.prepare(`SELECT COUNT(DISTINCT date(createdAt)) as streak FROM questions WHERE studentId = ?`).get(studentId);

        // 4. Recent Mentor Reply
        const recentReplyRow = db.prepare(`
            SELECT r.*, q.subject, u.name as mentorName 
            FROM replies r
            JOIN questions q ON r.questionId = q.id
            JOIN users u ON r.mentorId = u.id
            WHERE q.studentId = ?
            ORDER BY r.createdAt DESC
            LIMIT 1
        `).get(studentId) || null;

        // Return actual distinct days streak
        const streakDays = distinctDaysRow.streak || 0;

        // 5. Attached limited subset of actual packs as snippet
        const recentPacksList = db.prepare('SELECT * FROM packs ORDER BY createdAt DESC LIMIT 2').all();
        // Determine download status for these packs
        const recentPacks = recentPacksList.map(p => {
            const download = db.prepare('SELECT progress FROM student_downloads WHERE studentId = ? AND packId = ?').get(studentId, p.id);
            return {
                ...p,
                downloaded: !!download,
                progress: download ? download.progress : 0
            };
        });

        res.json({
            questionsCount: questionsRow.count,
            packsFinished: packsRow.count,
            streak: streakDays,
            recentReply: recentReplyRow,
            recentPacks: recentPacks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch student dashboard info' });
    }
});

module.exports = router;
