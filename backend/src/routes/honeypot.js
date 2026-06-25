const express = require('express');
const router = express.Router();
const { logAttack, getStats, getLogs, clearLogs } = require('../modules/honeypot/honeypot');
const { requireAuth } = require('../middleware/auth');

const HONEYPOT_ENDPOINTS = [
  '/admin', '/admin/login', '/wp-admin', '/wp-login.php',
  '/phpmyadmin', '/.env', '/config.php', '/backup.sql',
  '/.git/config', '/shell.php', '/administrator',
  '/api/users', '/api/admin', '/console', '/debug'
];

HONEYPOT_ENDPOINTS.forEach(endpoint => {
  router.all(endpoint, (req, res) => {
    logAttack(req);
    res.status(403).json({
      error: 'Access Denied',
      message: 'You do not have permission to access this resource',
      timestamp: new Date().toISOString()
    });
  });
});

router.get('/stats', requireAuth, (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    const stats = getStats(timeRange);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logs', requireAuth, (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = getLogs(parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clear', requireAuth, (req, res) => {
  try {
    if (req.user.role !== 'dev' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    clearLogs();
    res.json({ message: 'Honeypot logs cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
