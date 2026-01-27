const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Trismegiste';

app.use(express.json());
app.use(express.static('.'));

function readData(filename) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeData(filename, data) {
  fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

function checkAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/outputs', (req, res) => {
  res.json(readData('outputs.json'));
});

app.put('/api/outputs', checkAuth, (req, res) => {
  writeData('outputs.json', req.body);
  res.json({ success: true });
});

app.get('/api/members', (req, res) => {
  res.json(readData('members.json'));
});

app.put('/api/members', checkAuth, (req, res) => {
  writeData('members.json', req.body);
  res.json({ success: true });
});

app.get('/api/funding', (req, res) => {
  res.json(readData('funding.json'));
});

app.put('/api/funding', checkAuth, (req, res) => {
  writeData('funding.json', req.body);
  res.json({ success: true });
});

app.get('/api/program', (req, res) => {
  res.json(readData('program.json'));
});

app.put('/api/program', checkAuth, (req, res) => {
  writeData('program.json', req.body);
  res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
