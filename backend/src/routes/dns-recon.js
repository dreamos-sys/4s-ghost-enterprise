const express = require('express');
const router = express.Router();
const { lookupRecords, checkSubdomains } = require('../modules/dns-recon');
const { requireAuth } = require('../middleware/auth');

router.post('/lookup', requireAuth, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }
    const result = await lookupRecords(domain);
    res.json(result);
  } catch (error) {
    console.error('DNS lookup error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/subdomains', requireAuth, async (req, res) => {
  try {
    const { domain, subdomains } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }
    const result = await checkSubdomains(domain, subdomains);
    res.json({ domain, subdomains: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
