const express = require('express');
const router = express.Router();
const { testSQLInjection, SQLI_PAYLOADS, extractParams } = require('../modules/sqli/tester');

// GET /api/sqli/payloads
router.get('/payloads', (req, res) => {
  res.json({
    attackTypes: Object.keys(SQLI_PAYLOADS),
    payloads: SQLI_PAYLOADS
  });
});

// POST /api/sqli/extract-params
router.post('/extract-params', (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const params = extractParams(url);
    res.json({ url, params });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sqli/test
router.post('/test', async (req, res) => {
  try {
    const { url, attackType = 'error-based', method = 'GET' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Validate attack type
    if (!SQLI_PAYLOADS[attackType]) {
      return res.status(400).json({ error: 'Invalid attack type' });
    }
    
    const results = await testSQLInjection(url, attackType, method);
    res.json(results);
  } catch (error) {
    console.error('SQLi test error:', error);
    res.status(500).json({ error: 'Test failed: ' + error.message });
  }
});

module.exports = router;
