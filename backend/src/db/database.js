const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/app.db');
const dataDir = path.join(__dirname, '../../data');

// Pastikan folder data ada
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;
let isShuttingDown = false;

async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Load existing database atau create new
  if (fs.existsSync(DB_PATH)) {
    try {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } catch (err) {
      console.log('⚠️  Database corrupted, creating new...');
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Init schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      refresh_token TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      ip TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);`);

  console.log('✅ Database initialized');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

function saveDatabase() {
  if (db && !isShuttingDown) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('⚠️  Failed to save database:', err.message);
    }
  }
}

// Auto-save setiap 30 detik
const autoSaveInterval = setInterval(() => {
  if (db && !isShuttingDown) {
    saveDatabase();
  }
}, 30000);

// Graceful shutdown
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n🛑 Shutting down gracefully...');
  
  clearInterval(autoSaveInterval);
  
  if (db) {
    try {
      saveDatabase();
      db.close();
      console.log('✅ Database closed');
    } catch (err) {
      // Ignore errors during shutdown
    }
  }
  
  process.exit(0);
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  cleanup();
});

module.exports = { initDatabase, getDb, saveDatabase };
