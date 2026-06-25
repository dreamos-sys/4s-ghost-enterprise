const express = require('express');
const router = express.Router();
const { checkRateLimit, simulateAttack, getConfigs, clearStore } = require('../modules/ratelimit/ratelimit');
const { requireAuth } = require('../middleware/auth');

// Get rate limit configs
router.get('/configs', requireAuth, (req, res) => {
  const configs = getConfigs();
  res.json(configs);
});

// Test rate limit
router.post('/test', requireAuth, (req, res) => {
  try {
    const { ip = '127.0.0.1', endpoint = '/api/test' } = req.body;
    const check = checkRateLimit(ip, endpoint);
    res.json(check);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate attack
router.post('/simulate', requireAuth, (req, res) => {
  try {
    const { endpoint = '/api/test', numRequests = 50, delayMs = 10 } = req.body;
    
    if (numRequests > 1000) {
      return res.status(400).json({ error: 'Max 1000 requests per simulation' });
    }
    
    const results = simulateAttack(endpoint, numRequests, delayMs);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear rate limit store
router.post('/clear', requireAuth, (req, res) => {
  try {
    clearStore();
    res.json({ message: 'Rate limit store cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
