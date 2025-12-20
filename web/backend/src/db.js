const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'data.db');

const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      filename TEXT,
      filepath TEXT,
      location TEXT,
      capture_time TEXT,
      source_type TEXT,
      notes TEXT,
      status TEXT,
      result TEXT,
      created_at INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS detections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      upload_id TEXT,
      type TEXT,
      count INTEGER,
      confidence INTEGER,
      color TEXT,
      created_at INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY,
      name TEXT,
      status TEXT,
      x INTEGER,
      y INTEGER,
      intensity INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS health (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      score INTEGER,
      water_color TEXT,
      pollution_level TEXT,
      foam_level TEXT,
      flow_rate TEXT,
      last_updated INTEGER
    )`);

    // seed default single-row health if missing
    db.get('SELECT COUNT(*) as c FROM health', (err, row) => {
      if (err) return console.error(err);
      if (row.c === 0) {
        db.run('INSERT INTO health (id,score,water_color,pollution_level,foam_level,flow_rate,last_updated) VALUES (1,?,?, ?,?, ?, ?)',
          [42, 'Fair', 'High', 'Medium', 'Normal', Date.now()]);
      }
    });

    // seed zones if empty
    db.get('SELECT COUNT(*) as c FROM zones', (err, row) => {
      if (err) return console.error(err);
      if (row.c === 0) {
        const zones = [
          [1, 'Zone A - Industrial Area', 'critical', 25, 30, 95],
          [2, 'Zone B - Residential', 'moderate', 60, 45, 58],
          [3, 'Zone C - Agricultural', 'clean', 80, 65, 22],
          [4, 'Zone D - Urban Center', 'critical', 45, 70, 88],
          [5, 'Zone E - Forest Reserve', 'clean', 70, 25, 15]
        ];
        const stmt = db.prepare('INSERT INTO zones (id,name,status,x,y,intensity) VALUES (?,?,?,?,?,?)');
        zones.forEach(z => stmt.run(...z));
        stmt.finalize();
      }
    });
  });
}

module.exports = { db, init };
