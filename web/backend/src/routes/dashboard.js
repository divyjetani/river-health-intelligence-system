const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/health', (req, res) => {
  db.get('SELECT * FROM health WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

router.get('/zones', (req, res) => {
  db.all('SELECT * FROM zones', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/detections', (req, res) => {
  db.all('SELECT * FROM detections ORDER BY created_at DESC LIMIT 50', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
