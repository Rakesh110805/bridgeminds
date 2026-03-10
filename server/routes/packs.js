const express = require('express');
const router = express.Router();

const demoPacks = [
  {
    id: 'pack-1',
    title: 'Python Basics — Offline Ready',
    subject: 'Computer Science',
    grade: '8th-10th',
    size: '45MB',
    lessons: 3,
    progress: 100,
    downloaded: true
  },
  {
    id: 'pack-2',
    title: 'Algebra Foundations',
    subject: 'Math',
    grade: '8th-10th',
    size: '120MB',
    lessons: 5,
    progress: 30,
    downloaded: true
  },
  {
    id: 'pack-3',
    title: 'Solar System VR Maps',
    subject: 'Science',
    grade: '6th-8th',
    size: '300MB',
    lessons: 1,
    progress: 0,
    downloaded: false
  }
];

router.get('/:studentId', (req, res) => {
  res.json(demoPacks);
});

module.exports = router;
