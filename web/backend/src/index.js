require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { init } = require('./db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/uploads');
const { addClient, removeClient } = require('./broadcaster');

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

init();

const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);

// SSE stream
app.get('/api/stream/live', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // send a ping event to confirm connection
  res.write('event: connected\ndata: true\n\n');
  addClient(res);

  req.on('close', () => {
    removeClient(res);
  });
});

app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
