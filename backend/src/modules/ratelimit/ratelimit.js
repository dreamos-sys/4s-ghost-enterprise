const { getDb, saveDatabase } = require('../../db/database');

// In-memory store for rate limiting (production should use Redis)
const requestStore = new Map();

// Default config
const DEFAULT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // max requests per window
  message: 'Too many requests, please try again later'
};

function getKey(ip, endpoint) {
  return `${ip}:${endpoint}`;
}

function checkRateLimit(ip, endpoint, config = DEFAULT_CONFIG) {
  const key = getKey(ip, endpoint);
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  if (!requestStore.has(key)) {
    requestStore.set(key, []);
  }
  
  const requests = requestStore.get(key);
  
  // Remove old requests outside window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  requestStore.set(key, recentRequests);
  
  // Check if limit exceeded
  if (recentRequests.length >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil((recentRequests[0] + config.windowMs - now) / 1000),
      total: config.maxRequests
    };
  }
  
  // Add current request
  recentRequests.push(now);
  requestStore.set(key, recentRequests);
  
  return {
    allowed: true,
    remaining: config.maxRequests - recentRequests.length,
    resetTime: Math.ceil(config.windowMs / 1000),
    total: config.maxRequests
  };
}

function simulateAttack(targetEndpoint, numRequests, delayMs = 10) {
  const results = {
    total: numRequests,
    allowed: 0,
    blocked: 0,
    responses: []
  };
  
  const ip = '192.168.1.100'; // Simulated attacker IP
  const config = { windowMs: 60000, maxRequests: 10 }; // 10 requests per minute
  
  for (let i = 0; i < numRequests; i++) {
    const check = checkRateLimit(ip, targetEndpoint, config);
    results.responses.push({
      request: i + 1,
      allowed: check.allowed,
      remaining: check.remaining,
      timestamp: new Date().toISOString()
    });
    
    if (check.allowed) {
      results.allowed++;
    } else {
      results.blocked++;
    }
  }
  
  return results;
}

function getConfigs() {
  return {
    default: DEFAULT_CONFIG,
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, message: 'Too many login attempts' },
    api: { windowMs: 1 * 60 * 1000, maxRequests: 60, message: 'API rate limit exceeded' },
    scanner: { windowMs: 1 * 60 * 1000, maxRequests: 10, message: 'Scanner rate limit exceeded' }
  };
}

function clearStore() {
  requestStore.clear();
}

module.exports = { checkRateLimit, simulateAttack, getConfigs, clearStore, DEFAULT_CONFIG };
