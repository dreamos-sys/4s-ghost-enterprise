const express = require('express');
const router = express.Router();
const { recordBeacon, getBeacons, getUniqueSessions, recordTrap, getTraps } = require('../modules/stealth/bridge');
const { requireAuth } = require('../middleware/auth');

// 🥷 STEALTH BEACON ENDPOINT (Public - no auth required)
// Dream OS akan kirim heartbeat ke sini
router.post('/beacon', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown';
  const result = recordBeacon(req.body, ip);
  
  // Response minimal (biar nggak keliatan mencurigakan)
  res.status(200).json({ status: 'ok' });
});

// 🍯 GHOST TRAP ENDPOINT (Public - honeypot)
// Scanner/bot yang iseng bakal kena trap di sini
router.all('/trap', (req, res) => {
  recordTrap(req);
  
  // Pura-pura error biar scanner kira ada vulnerability
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Database connection failed',
    timestamp: new Date().toISOString()
  });
});

// 📊 ADMIN ENDPOINTS (Auth required)
// Buat Kanjeng cek data beacon & trap

router.get('/beacons', requireAuth, (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = getBeacons(parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sessions', requireAuth, (req, res) => {
  try {
    const sessions = getUniqueSessions();
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/traps', requireAuth, (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = getTraps(parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats endpoint
router.get('/stats', requireAuth, (req, res) => {
  try {
    const beacons = getBeacons(1000, 0);
    const traps = getTraps(1000, 0);
    const sessions = getUniqueSessions();
    
    res.json({
      totalBeacons: beacons.total,
      totalTraps: traps.total,
      uniqueSessions: sessions.length,
      recentBeacons: beacons.beacons.slice(0, 10),
      recentTraps: traps.traps.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
