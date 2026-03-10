const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db'); // import the SQLite database

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecrethackathon_key', {
    expiresIn: '30d',
  });
};

router.post('/register', (req, res) => {
  const { name, role, email, password } = req.body;

  if (!name || !role || (!email && !password)) {
    return res.status(400).json({ message: 'Please provide required fields' });
  }

  const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: 'usr_' + Date.now().toString(),
    name,
    role: role.toUpperCase(), // 'STUDENT' or 'MENTOR'
    email,
    password // skipping hash for hackathon speed
  };

  const insert = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (@id, @name, @email, @password, @role)');
  insert.run(newUser);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    role: newUser.role,
    token: generateToken(newUser),
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);

  // DEMO SHORTCUT: if auth fails but they try 'demo@demo.com', auto-create if missing and let them in
  if (!user && email === 'demo@demo.com') {
    const demoUser = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@demo.com');
    if (!demoUser) {
      db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
        'demo-123', 'Demo Student', 'demo@demo.com', 'password', 'STUDENT'
      );
    }
    return res.json({
      id: 'demo-123',
      name: 'Demo Student',
      role: 'STUDENT',
      token: generateToken({ id: 'demo-123', role: 'STUDENT' }),
    });
  }

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
