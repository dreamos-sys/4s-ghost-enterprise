const express = require('express');
const router = express.Router();
const { analyzeIP, getThreatLandscape, predictThreats } = require('../modules/ai/defense');
const { requireAuth } = require('../middleware/auth');

// Get overall threat landscape
router.get('/landscape', requireAuth, (req, res) => {
  try {
    const landscape = getThreatLandscape();
    res.json(landscape);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze specific IP
router.get('/analyze-ip/:ip', requireAuth, (req, res) => {
  try {
    const result = analyzeIP(req.params.ip);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get threat predictions
router.get('/predictions', requireAuth, (req, res) => {
  try {
    const predictions = predictThreats();
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
