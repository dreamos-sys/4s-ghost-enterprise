const express = require('express');
const router = express.Router();
const { analyzeHeaders } = require('../modules/http-analyzer');
const { requireAuth } = require('../middleware/auth');

router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const result = await analyzeHeaders(url);
    res.json(result);
  } catch (error) {
    console.error('HTTP analyze error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
