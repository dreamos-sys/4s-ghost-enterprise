const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// Data terbaru yang disimpan
let latestReport = {
  securityScore: 100,
  threats: [],
  towerId: 'UNKNOWN',
  signalStrength: 0
};

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mobile-dashboard.html'));
});

// Endpoint penerima data mobile
app.post('/api/mobile/report', (req, res) => {
  const { signal, tower, timestamp } = req.body;
  console.log(`[${new Date(timestamp * 1000).toLocaleTimeString()}] Signal: ${signal} dBm | Tower: ${tower}`);

  let securityScore = 100;
  const threats = [];

  if (tower.includes('FAKE')) {
    securityScore -= 30;
    threats.push({
      id: Date.now(),
      type: 'FAKE_TOWER_DETECTED',
      severity: 'HIGH',
      message: 'IMSI Catcher / Fake BTS suspected',
      timestamp: new Date().toLocaleTimeString()
    });
  }

  if (signal < -100) {
    securityScore -= 10;
    threats.push({
      id: Date.now() + 1,
      type: 'LOW_SIGNAL',
      severity: 'LOW',
      message: 'Signal very weak, possible interference',
      timestamp: new Date().toLocaleTimeString()
    });
  }

  latestReport = { securityScore, threats, towerId: tower, signalStrength: signal };

  res.json(latestReport);
});

// Endpoint untuk dashboard mengambil data terbaru
app.get('/api/mobile/report/latest', (req, res) => {
  res.json(latestReport);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('📡 Backend + Dashboard running on http://localhost:3000');
});
