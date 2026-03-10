const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard/:studentId', (req, res) => {
    try {
        const { studentId } = req.params;

        // 1. Questions Count
        const questionsRow = db.prepare('SELECT COUNT(*) as count FROM questions WHERE studentId = ?').get(studentId);

        // 2. Packs Finished
        const packsRow = db.prepare('SELECT COUNT(*) as count FROM student_downloads WHERE studentId = ? AND progress = 100').get(studentId);

        // 3. Streak
        const distinctDaysRow = db.prepare(`SELECT COUNT(DISTINCT date(createdAt)) as streak FROM questions WHERE studentId = ?`).get(studentId);
        const streakDays = distinctDaysRow.streak || 0;

        // 4. Languages Bridged
        const langRow = db.prepare(`SELECT COUNT(DISTINCT sourceLang) as count FROM questions WHERE studentId = ?`).get(studentId);
        const languagesBridged = langRow.count || 0;

        // 5. Recent Mentor Reply
        const recentReplyRow = db.prepare(`
            SELECT r.*, q.subject, u.name as mentorName
            FROM replies r
            JOIN questions q ON r.questionId = q.id
            JOIN users u ON r.mentorId = u.id
            WHERE q.studentId = ?
            ORDER BY r.createdAt DESC
            LIMIT 1
        `).get(studentId) || null;

        // 6. Last 7 days activity heatmap
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
            const row = db.prepare(`SELECT COUNT(*) as active FROM questions WHERE studentId = ? AND date(createdAt) = ?`).get(studentId, dateStr);
            last7Days.push({ date: dateStr, label, active: row.active > 0 });
        }

        // 7. Recent packs with download status
        const recentPacksList = db.prepare('SELECT * FROM packs ORDER BY createdAt DESC LIMIT 4').all();
        const recentPacks = recentPacksList.map(p => {
            const download = db.prepare('SELECT progress FROM student_downloads WHERE studentId = ? AND packId = ?').get(studentId, p.id);
            return { ...p, downloaded: !!download, progress: download ? download.progress : 0 };
        });

        res.json({
            questionsCount: questionsRow.count,
            packsFinished: packsRow.count,
            streak: streakDays,
            languagesBridged,
            last7Days,
            recentReply: recentReplyRow,
            recentPacks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch student dashboard info' });
    }
});

module.exports = router;
