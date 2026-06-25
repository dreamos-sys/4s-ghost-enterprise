const express = require('express');
const router = express.Router();
const { scanPorts, parsePorts, COMMON_PORTS } = require('../modules/scanner/scanner');

// GET /api/scanner/presets
router.get('/presets', (req, res) => {
  res.json({
    presets: COMMON_PORTS
  });
});

// POST /api/scanner/ports
router.post('/ports', async (req, res) => {
  try {
    const { host, ports: portsInput, timeout = 1000, concurrency = 10 } = req.body;
    
    if (!host) {
      return res.status(400).json({ error: 'Host is required' });
    }
    
    if (!portsInput) {
      return res.status(400).json({ error: 'Ports are required' });
    }
    
    // Parse ports input
    const ports = parsePorts(portsInput);
    
    if (ports.length === 0) {
      return res.status(400).json({ error: 'No valid ports specified' });
    }
    
    if (ports.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 ports per scan' });
    }
    
    // Validate timeout
    if (timeout < 100 || timeout > 10000) {
      return res.status(400).json({ error: 'Timeout must be between 100ms and 10000ms' });
    }
    
    // Scan ports
    const results = await scanPorts(host, ports, timeout, concurrency);
    
    res.json(results);
  } catch (error) {
    console.error('Port scan error:', error);
    res.status(500).json({ error: 'Scan failed: ' + error.message });
  }
});

// POST /api/scanner/single
router.post('/single', async (req, res) => {
  try {
    const { host, port, timeout = 1000 } = req.body;
    
    if (!host || !port) {
      return res.status(400).json({ error: 'Host and port are required' });
    }
    
    const result = await scanPorts(host, [port], timeout, 1);
    res.json(result.results[0]);
  } catch (error) {
    console.error('Single port scan error:', error);
    res.status(500).json({ error: 'Scan failed: ' + error.message });
  }
});

module.exports = router;
