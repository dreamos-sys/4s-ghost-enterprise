const express = require('express');
const router = express.Router();
const { generateHash, generateMultipleHashes, detectHashType, compareHashes } = require('../modules/hash-generator');
const { requireAuth } = require('../middleware/auth');

router.post('/generate', requireAuth, (req, res) => {
  try {
    const { input, algorithm = 'sha256', encoding = 'utf8' } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });
    const result = generateHash(input, algorithm, encoding);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-all', requireAuth, (req, res) => {
  try {
    const { input, encoding = 'utf8' } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });
    const result = generateMultipleHashes(input, encoding);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/detect', requireAuth, (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) return res.status(400).json({ error: 'Hash is required' });
    const type = detectHashType(hash);
    res.json({ hash, detectedType: type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/compare', requireAuth, (req, res) => {
  try {
    const { input, hashes } = req.body;
    if (!input || !hashes) return res.status(400).json({ error: 'Input and hashes are required' });
    const results = compareHashes(input, hashes);
    res.json({ input, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
