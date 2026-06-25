const express = require('express');
const router = express.Router();
const { scanContent, scanURL, XSS_PATTERNS } = require('../modules/xss/scanner');

// GET /api/xss/patterns
router.get('/patterns', (req, res) => {
  res.json({
    patterns: XSS_PATTERNS.map(p => ({
      name: p.name,
      severity: p.severity,
      description: p.description
    }))
  });
});

// POST /api/xss/scan-content
router.post('/scan-content', (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (content.length > 1000000) {
      return res.status(400).json({ error: 'Content too large (max 1MB)' });
    }
    
    const results = scanContent(content);
    res.json(results);
  } catch (error) {
    console.error('XSS scan error:', error);
    res.status(500).json({ error: 'Scan failed: ' + error.message });
  }
});

// POST /api/xss/scan-url
router.post('/scan-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const results = await scanURL(url);
    res.json(results);
  } catch (error) {
    console.error('XSS URL scan error:', error);
    res.status(500).json({ error: 'Scan failed: ' + error.message });
  }
});

module.exports = router;
