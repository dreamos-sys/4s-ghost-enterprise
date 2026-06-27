const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('../routes/auth');

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: '4S Ghost Enterprise API',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database setup (SQLite)
const Database = require('sql.js');
const fs = require('fs');

const DB_PATH = './data/app.db';

// Initialize database
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data', { recursive: true });
}

let db;
if (fs.existsSync(DB_PATH)) {
  const fileBuffer = fs.readFileSync(DB_PATH);
  db = new Database(fileBuffer);
} else {
  db = new Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDatabase();
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Database initialized');
  console.log(`🚀 4S Ghost Enterprise API`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📖 API: http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: ${DB_PATH} (SQLite via sql.js)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (db) {
    db.close();
  }
  console.log('✅ Database closed');
  process.exit(0);
});

module.exports = app;
