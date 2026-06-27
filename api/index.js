const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import routes dari backend
// Note: Sesuaikan path dengan struktur folder backend
try {
  const authRoutes = require('../backend/routes/auth');
  app.use('/api/auth', authRoutes);
  
  // Import routes lainnya jika ada
  // const toolsRoutes = require('../backend/routes/tools');
  // app.use('/api/tools', toolsRoutes);
} catch (error) {
  console.log('Routes belum tersedia, menggunakan default route');
}

// Default route
app.get('/api', (req, res) => {
  res.json({ 
    message: '4S Ghost API is running!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export untuk Vercel
module.exports.handler = serverless(app);
