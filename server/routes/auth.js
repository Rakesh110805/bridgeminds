const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Simple mock user database
const users = [];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

router.post('/register', (req, res) => {
  const { name, role, email, password } = req.body;
  
  if (!name || !role || (!email && !password)) {
    return res.status(400).json({ message: 'Please provide required fields' });
  }

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    role: role.toUpperCase(), // 'STUDENT' or 'MENTOR'
    email,
    password // skipping hash for hackathon speed
  };

  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    role: newUser.role,
    token: generateToken(newUser),
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  // DEMO SHORTCUT: if auth fails but they try 'demo@demo.com', let them in
  if (!user && email === 'demo@demo.com') {
    return res.json({
      id: 'demo-123',
      name: 'Demo User',
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
