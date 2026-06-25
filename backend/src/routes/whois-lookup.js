const express = require('express');
const router = express.Router();
const { lookupDomain } = require('../modules/whois-lookup');
const { requireAuth } = require('../middleware/auth');

router.post('/lookup', requireAuth, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }
    const result = await lookupDomain(domain);
    res.json(result);
  } catch (error) {
    console.error('WHOIS error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
