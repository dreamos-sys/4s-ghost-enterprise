const express = require('express');
const router = express.Router();
const { analyzeRequest, analyzeUserAgent, logDetection, BOT_PATTERNS } = require('../modules/botdetector/botdetector');
const { requireAuth } = require('../middleware/auth');

// Analyze current request
router.post('/analyze', requireAuth, (req, res) => {
  try {
    const { metrics = {} } = req.body;
    const result = analyzeRequest(req, metrics);
    logDetection(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze custom User-Agent
router.post('/analyze-ua', requireAuth, (req, res) => {
  try {
    const { userAgent } = req.body;
    if (!userAgent) {
      return res.status(400).json({ error: 'userAgent is required' });
    }
    const result = analyzeUserAgent(userAgent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bot patterns
router.get('/patterns', requireAuth, (req, res) => {
  const summary = {};
  for (const [category, patterns] of Object.entries(BOT_PATTERNS)) {
    summary[category] = patterns.length;
  }
  res.json({
    totalPatterns: Object.values(BOT_PATTERNS).reduce((sum, p) => sum + p.length, 0),
    categories: summary
  });
});

// Get test User-Agents
router.get('/test-agents', requireAuth, (req, res) => {
  res.json({
    human: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0'
    ],
    bots: [
      'Googlebot/2.1 (+http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'curl/7.68.0',
      'python-requests/2.28.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36',
      'sqlmap/1.7.2#stable (http://sqlmap.org)',
      'Nikto/2.1.6'
    ]
  });
});

module.exports = router;
