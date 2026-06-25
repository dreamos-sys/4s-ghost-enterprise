const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, saveDatabase } = require('../../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

// Register
async function register(email, password, name = null, role = 'user') {
  const db = getDb();
  
  const existing = db.exec(`SELECT id FROM users WHERE email = '${email}'`);
  if (existing.length > 0 && existing[0].values.length > 0) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  db.run(
    `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
    [email, hashedPassword, name, role]
  );

  const result = db.exec(`SELECT last_insert_rowid() as id`);
  const userId = result[0].values[0][0];

  saveDatabase();

  return {
    id: userId,
    email,
    name,
    role
  };
}

// Login
async function login(email, password) {
  const db = getDb();
  
  const result = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
  if (result.length === 0 || result[0].values.length === 0) {
    throw new Error('Invalid credentials');
  }

  const userRow = result[0].values[0];
  const columns = result[0].columns;
  
  const user = {};
  columns.forEach((col, idx) => {
    user[col] = userRow[idx];
  });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Save session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.run(
    `INSERT INTO sessions (user_id, token, refresh_token, expires_at) VALUES (?, ?, ?, ?)`,
    [user.id, accessToken, refreshToken, expiresAt]
  );

  // Audit log
  db.run(
    `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
    [user.id, 'login', 'User logged in successfully']
  );

  saveDatabase();

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken
  };
}

// Verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Logout
function logout(token) {
  const db = getDb();
  db.run(`DELETE FROM sessions WHERE token = ?`, [token]);
  saveDatabase();
}

module.exports = { register, login, verifyToken, logout };
