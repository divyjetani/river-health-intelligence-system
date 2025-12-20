const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  const created_at = Date.now();
  db.run('INSERT INTO users (id,name,email,password,created_at) VALUES (?,?,?,?,?)', [id, name, email, hashed, created_at], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const token = jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email } });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

module.exports = router;
