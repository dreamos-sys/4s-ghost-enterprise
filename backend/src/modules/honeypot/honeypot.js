const { getDb, saveDatabase } = require('../../db/database');

const ATTACK_PATTERNS = {
  sqli: [
    /union.*select/i, /or.*1.*=.*1/i, /'.*or.*'/i, /admin.*--/i,
    /sleep\(/i, /benchmark\(/i, /waitfor/i, /information_schema/i
  ],
  xss: [
    /<script/i, /javascript:/i, /on\w+\s*=/i, /alert\(/i,
    /<iframe/i, /<svg.*on/i, /document\.cookie/i
  ],
  traversal: [
    /\.\.\//i, /\.\.\\\\/i, /etc\/passwd/i, /proc\/self/i,
    /windows\\\\system32/i, /boot\.ini/i
  ],
  scan: [
    /wp-admin/i, /phpmyadmin/i, /admin/i, /\.env/i,
    /config\.php/i, /backup/i, /\.git/i, /shell/i
  ]
};

function detectAttackType(path, payload = '') {
  const combined = (path + ' ' + payload).toLowerCase();
  for (const [type, patterns] of Object.entries(ATTACK_PATTERNS)) {
    if (patterns.some(p => p.test(combined))) return type;
  }
  return 'other';
}

function logAttack(req) {
  const db = getDb();
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const path = req.path;
  const method = req.method;
  const payload = JSON.stringify(req.query || {}) + ' ' + JSON.stringify(req.body || {});
  const attackType = detectAttackType(path, payload);
  const headers = JSON.stringify(req.headers);

  try {
    db.run(
      'INSERT INTO honeypot_logs (ip, user_agent, method, path, attack_type, payload, headers) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ip, userAgent, method, path, attackType, payload, headers]
    );
    saveDatabase();
    console.log('🍯 Honeypot: ' + attackType.toUpperCase() + ' from ' + ip + ' -> ' + path);
  } catch (err) {
    console.error('Failed to log honeypot attack:', err.message);
  }
}

function getStats(timeRange = '24h') {
  const db = getDb();
  let timeFilter = '';
  if (timeRange === '1h') timeFilter = "AND created_at >= datetime('now', '-1 hour')";
  else if (timeRange === '24h') timeFilter = "AND created_at >= datetime('now', '-24 hours')";
  else if (timeRange === '7d') timeFilter = "AND created_at >= datetime('now', '-7 days')";

  const total = db.exec('SELECT COUNT(*) FROM honeypot_logs WHERE 1=1 ' + timeFilter);
  const byType = db.exec('SELECT attack_type, COUNT(*) FROM honeypot_logs WHERE 1=1 ' + timeFilter + ' GROUP BY attack_type ORDER BY COUNT(*) DESC');
  const topIPs = db.exec('SELECT ip, COUNT(*) FROM honeypot_logs WHERE 1=1 ' + timeFilter + ' GROUP BY ip ORDER BY COUNT(*) DESC LIMIT 10');
  const topUserAgents = db.exec('SELECT user_agent, COUNT(*) FROM honeypot_logs WHERE 1=1 ' + timeFilter + ' GROUP BY user_agent ORDER BY COUNT(*) DESC LIMIT 5');
  const uniqueIPs = db.exec('SELECT COUNT(DISTINCT ip) FROM honeypot_logs WHERE 1=1 ' + timeFilter);

  return {
    totalAttacks: total[0]?.values[0][0] || 0,
    uniqueAttackers: uniqueIPs[0]?.values[0][0] || 0,
    byType: byType[0]?.values.map(v => ({ type: v[0], count: v[1] })) || [],
    topIPs: topIPs[0]?.values.map(v => ({ ip: v[0], count: v[1] })) || [],
    topUserAgents: topUserAgents[0]?.values.map(v => ({ ua: v[0], count: v[1] })) || []
  };
}

function getLogs(limit = 50, offset = 0) {
  const db = getDb();
  const logs = db.exec('SELECT * FROM honeypot_logs ORDER BY created_at DESC LIMIT ' + limit + ' OFFSET ' + offset);
  const total = db.exec('SELECT COUNT(*) FROM honeypot_logs');
  if (!logs[0]) return { logs: [], total: 0 };
  const columns = logs[0].columns;
  const rows = logs[0].values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => { obj[col] = row[idx]; });
    return obj;
  });
  return { logs: rows, total: total[0]?.values[0][0] || 0 };
}

function clearLogs() {
  const db = getDb();
  db.run('DELETE FROM honeypot_logs');
  saveDatabase();
}

module.exports = { logAttack, getStats, getLogs, clearLogs, detectAttackType };
