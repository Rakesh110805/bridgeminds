require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/ask', require('./routes/ask'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packs', require('./routes/packs'));
app.use('/api/match', require('./routes/match'));
app.use('/api/student', require('./routes/student'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('BridgeMinds backend running on port ' + PORT);
});
