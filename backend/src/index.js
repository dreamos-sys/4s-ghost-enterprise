const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { initDatabase, getDb } = require('./db/database');
const auth = require('./modules/auth/auth');
const { requireAuth } = require('./middleware/auth');
const scannerRoutes = require('./routes/scanner');
const xssRoutes = require('./routes/xss');
const sqliRoutes = require('./routes/sqli');
const honeypotRoutes = require('./routes/honeypot');
const ratelimitRoutes = require('./routes/ratelimit');

async function startServer() {
  await initDatabase();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  app.get('/health', (req, res) => {
    const db = getDb();
    const usersCount = db.exec(`SELECT COUNT(*) as count FROM users`);
    const sessionsCount = db.exec(`SELECT COUNT(*) as count FROM sessions`);
    const logsCount = db.exec(`SELECT COUNT(*) as count FROM audit_logs`);

    const stats = {
      users: usersCount[0]?.values[0][0] || 0,
      sessions: sessionsCount[0]?.values[0][0] || 0,
      logs: logsCount[0]?.values[0][0] || 0
    };
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'SQLite (sql.js)',
      stats
    });
  });

  app.get('/api', (req, res) => {
    res.json({ 
      name: '4S Ghost Enterprise API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /health',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (auth required)',
        logout: 'POST /api/auth/logout (auth required)',
        scanner: 'POST /api/scanner/ports (auth required)',
        xss: 'POST /api/xss/scan-content, POST /api/xss/scan-url (auth required)',
        sqli: 'POST /api/sqli/test (auth required)',
        honeypot: 'GET /api/honeypot/stats, GET /api/honeypot/logs (auth required)'
      }
    });
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const user = await auth.register(email, password, name);
      res.status(201).json({ message: 'User registered', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const result = await auth.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    const db = getDb();
    const result = db.exec(`SELECT id, email, name, role, created_at FROM users WHERE id = ${req.user.userId}`);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const columns = result[0].columns;
    const userRow = result[0].values[0];
    const user = {};
    columns.forEach((col, idx) => { user[col] = userRow[idx]; });
    res.json({ user });
  });

  app.post('/api/auth/logout', requireAuth, (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    auth.logout(token);
    res.json({ message: 'Logged out successfully' });
  });

  // Honeypot routes (MUST be first to catch suspicious paths)
  app.use('/honeypot', honeypotRoutes);

  app.use('/api/scanner', requireAuth, scannerRoutes);
  app.use('/api/xss', requireAuth, xssRoutes);
  app.use('/api/sqli', requireAuth, sqliRoutes);
  app.use('/api/honeypot', honeypotRoutes);
  app.use('/api/ratelimit', ratelimitRoutes);

  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 4S Ghost Enterprise API`);
    console.log(`📍 Running on http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`📖 API: http://localhost:${PORT}/api`);
    console.log(`🗄️  Database: data/app.db (SQLite via sql.js)`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
