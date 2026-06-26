const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/app.db');
const dataDir = path.join(__dirname, '../../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;
let isShuttingDown = false;

async function initDatabase() {
  const SQL = await initSqlJs();
  
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

  // Users table
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

  // Sessions table
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

  // Audit logs table
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

  // Honeypot logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS honeypot_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      method TEXT,
      path TEXT,
      attack_type TEXT,
      payload TEXT,
      headers TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_honeypot_ip ON honeypot_logs(ip);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_honeypot_type ON honeypot_logs(attack_type);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_honeypot_date ON honeypot_logs(created_at);`);

  
  // Stealth Bridge tables (Dream OS integration)
  db.run(`
    CREATE TABLE IF NOT EXISTS stealth_beacons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      page TEXT,
      user_agent TEXT,
      status TEXT DEFAULT 'active',
      ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ghost_traps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      user_agent TEXT,
      path TEXT,
      method TEXT,
      headers TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_beacon_session ON stealth_beacons(session_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_beacon_time ON stealth_beacons(timestamp);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_trap_ip ON ghost_traps(ip);`);

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

const autoSaveInterval = setInterval(() => {
  if (db && !isShuttingDown) {
    saveDatabase();
  }
}, 30000);

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
    } catch (err) {}
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
