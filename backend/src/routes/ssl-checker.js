const express = require('express');
const router = express.Router();
const { checkCertificate } = require('../modules/ssl-checker');
const { requireAuth } = require('../middleware/auth');

router.post('/check', requireAuth, async (req, res) => {
  try {
    const { domain, port = 443 } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Clean domain
    let cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .replace(/:.*$/, '')
      .trim();

    const result = await checkCertificate(cleanDomain, port);
    res.json(result);
  } catch (error) {
    console.error('SSL check error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
