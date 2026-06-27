const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Simple in-memory "database"
const users = [
  { id: 1, email: 'admin@dreamos.dev', role: 'admin' }
];

// Login endpoint - NO PASSWORD
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email (no password check)
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dream-os-super-secret-jwt-key-2026',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: '4S Ghost API is running!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export untuk Vercel
module.exports = app;
module.exports.handler = serverless(app);
