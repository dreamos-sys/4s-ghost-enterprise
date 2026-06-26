const { getDb, saveDatabase } = require('../../db/database');

// Record beacon from Dream OS
function recordBeacon(data, ip) {
  const db = getDb();
  
  try {
    db.run(
      'INSERT INTO stealth_beacons (session_id, page, user_agent, status, ip) VALUES (?, ?, ?, ?, ?)',
      [
        data.sessionId || 'unknown',
        data.page || '/',
        data.userAgent || 'Unknown',
        data.status || 'active',
        ip || 'unknown'
      ]
    );
    saveDatabase();
    
    console.log('🥷 Stealth Beacon: ' + data.sessionId + ' from ' + ip);
    return { success: true, message: 'Beacon recorded' };
  } catch (err) {
    console.error('❌ Beacon error:', err.message);
    return { success: false, error: err.message };
  }
}

// Get all beacons (for admin dashboard)
function getBeacons(limit = 100, offset = 0) {
  const db = getDb();
  const beacons = db.exec(
    'SELECT * FROM stealth_beacons ORDER BY timestamp DESC LIMIT ' + limit + ' OFFSET ' + offset
  );
  
  if (!beacons[0]) return { beacons: [], total: 0 };
  
  const columns = beacons[0].columns;
  const rows = beacons[0].values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => { obj[col] = row[idx]; });
    return obj;
  });
  
  const total = db.exec('SELECT COUNT(*) FROM stealth_beacons');
  
  return { beacons: rows, total: total[0]?.values[0][0] || 0 };
}

// Get unique sessions
function getUniqueSessions() {
  const db = getDb();
  const sessions = db.exec(
    'SELECT session_id, COUNT(*) as beacon_count, MAX(timestamp) as last_seen FROM stealth_beacons GROUP BY session_id ORDER BY last_seen DESC'
  );
  
  if (!sessions[0]) return [];
  
  return sessions[0].values.map(row => ({
    sessionId: row[0],
    beaconCount: row[1],
    lastSeen: row[2]
  }));
}

// Record trap (honeypot trigger)
function recordTrap(req) {
  const db = getDb();
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown';
  
  try {
    db.run(
      'INSERT INTO ghost_traps (ip, user_agent, path, method, headers) VALUES (?, ?, ?, ?, ?)',
      [
        ip,
        req.headers['user-agent'] || 'Unknown',
        req.path,
        req.method,
        JSON.stringify(req.headers)
      ]
    );
    saveDatabase();
    
    console.log('🍯 Ghost Trap: ' + ip + ' -> ' + req.path);
    return { success: true, message: 'Trap recorded' };
  } catch (err) {
    console.error('❌ Trap error:', err.message);
    return { success: false, error: err.message };
  }
}

// Get all traps
function getTraps(limit = 100, offset = 0) {
  const db = getDb();
  const traps = db.exec(
    'SELECT * FROM ghost_traps ORDER BY timestamp DESC LIMIT ' + limit + ' OFFSET ' + offset
  );
  
  if (!traps[0]) return { traps: [], total: 0 };
  
  const columns = traps[0].columns;
  const rows = traps[0].values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => { obj[col] = row[idx]; });
    return obj;
  });
  
  const total = db.exec('SELECT COUNT(*) FROM ghost_traps');
  
  return { traps: rows, total: total[0]?.values[0][0] || 0 };
}

module.exports = { recordBeacon, getBeacons, getUniqueSessions, recordTrap, getTraps };
