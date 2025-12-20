const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { processUpload } = require('../utils/processor');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const { location, capture_time, source_type, notes } = req.body;
  if (!req.file) return res.status(400).json({ error: 'file missing' });
  const id = uuidv4();
  const created_at = Date.now();
  const status = 'processing';
  const filepath = req.file.path;
  db.run('INSERT INTO uploads (id,filename,filepath,location,capture_time,source_type,notes,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)',
    [id, req.file.originalname, filepath, location || '', capture_time || '', source_type || '', notes || '', status, created_at], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // start simulated processing async
      processUpload({ id, filepath, originalname: req.file.originalname });
      res.json({ id, status });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM uploads WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

router.get('/', (req, res) => {
  db.all('SELECT * FROM uploads ORDER BY created_at DESC LIMIT 100', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
