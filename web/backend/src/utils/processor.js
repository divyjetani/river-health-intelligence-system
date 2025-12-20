const { db } = require('../db');
const { broadcastEvent } = require('../broadcaster');
const PROCESSING_DELAY_MS = parseInt(process.env.PROCESSING_DELAY_MS || '5000', 10);

function processUpload({ id, filepath, originalname }) {
  console.log('Processing upload', id);
  // simple simulation: after delay, write detections and update health and mark upload result
  setTimeout(() => {
    const now = Date.now();
    const detections = [
      ['Plastic Bottles',  Math.floor(Math.random()*30)+5, Math.floor(Math.random()*10)+85, 'bg-red-500'],
      ['Foam Accumulation', Math.floor(Math.random()*20)+2, Math.floor(Math.random()*10)+80, 'bg-amber-500']
    ];

    const stmt = db.prepare('INSERT INTO detections (upload_id,type,count,confidence,color,created_at) VALUES (?,?,?,?,?,?)');
    detections.forEach(d => stmt.run(id, d[0], d[1], d[2], d[3], now));
    stmt.finalize();

    // update upload status and put a JSON summary in result
    const result = JSON.stringify({ detections: detections.map(d => ({ type: d[0], count: d[1], confidence: d[2] })) });
    db.run('UPDATE uploads SET status = ?, result = ? WHERE id = ?', ['done', result, id]);

    // update health score slightly
    db.get('SELECT score FROM health WHERE id = 1', (err, row) => {
      if (err) return console.error(err);
      const base = row ? row.score : 42;
      const newScore = Math.max(0, Math.min(100, base - Math.floor(Math.random()*6)));
      db.run('UPDATE health SET score = ?, last_updated = ? WHERE id = 1', [newScore, Date.now()]);

      // broadcast events
      const payload = {
        type: 'upload_processed',
        uploadId: id,
        detections: detections.map(d => ({ type: d[0], count: d[1], confidence: d[2] })),
        healthScore: newScore,
        timestamp: Date.now()
      };
      broadcastEvent('detection', payload);
    });

    console.log('Processing complete', id);
  }, PROCESSING_DELAY_MS);
}

module.exports = { processUpload };
