const express = require('express');
const router = express.Router();

const mockMentors = [
  {
    id: 'mentor-demo',
    name: 'Dr. Amara Osei',
    subject: 'Computer Science',
    location: 'Ghana',
    language: 'English',
    responseRate: 98,
    online: true,
  },
  {
    id: 'mentor-2',
    name: 'Rahul Patel',
    subject: 'Math',
    location: 'India',
    language: 'Hindi, English',
    responseRate: 95,
    online: false,
  }
];

router.post('/', (req, res) => {
  const { subject, language, grade } = req.body;
  // Simplistic matching logic for demo
  const matched = mockMentors.sort((a, b) => b.responseRate - a.responseRate);
  res.json({ mentors: matched.slice(0, 3) });
});

module.exports = router;
