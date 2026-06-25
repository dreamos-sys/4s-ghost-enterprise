const net = require('net');

// Check single port
function checkPort(host, port, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const startTime = Date.now();
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        port,
        status: 'open',
        responseTime
      });
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve({
        port,
        status: 'closed',
        responseTime: timeout
      });
    });
    
    socket.on('error', (err) => {
      socket.destroy();
      resolve({
        port,
        status: 'closed',
        responseTime: Date.now() - startTime,
        error: err.code
      });
    });
    
    socket.connect(port, host);
  });
}

// Scan multiple ports
async function scanPorts(host, ports, timeout = 1000, concurrency = 10) {
  const results = [];
  const startTime = Date.now();
  
  // Process ports in batches (concurrency control)
  for (let i = 0; i < ports.length; i += concurrency) {
    const batch = ports.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(port => checkPort(host, port, timeout))
    );
    results.push(...batchResults);
  }
  
  const scanTime = Date.now() - startTime;
  
  return {
    host,
    totalPorts: ports.length,
    openPorts: results.filter(r => r.status === 'open').length,
    closedPorts: results.filter(r => r.status === 'closed').length,
    scanTime,
    results
  };
}

// Parse port input (single, range, or comma-separated)
function parsePorts(input) {
  const ports = new Set();
  
  // Handle comma-separated
  const parts = input.split(',').map(p => p.trim());
  
  parts.forEach(part => {
    // Handle range (e.g., "80-90")
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= 65535) ports.add(i);
        }
      }
    } else {
      // Single port
      const port = Number(part);
      if (!isNaN(port) && port > 0 && port <= 65535) {
        ports.add(port);
      }
    }
  });
  
  return Array.from(ports).sort((a, b) => a - b);
}

// Common port presets
const COMMON_PORTS = {
  web: [80, 443, 8080, 8443],
  database: [3306, 5432, 27017, 6379],
  ssh: [22, 2222],
  mail: [25, 110, 143, 465, 587, 993, 995],
  ftp: [20, 21],
  dns: [53],
  full: [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5900, 8080]
};

module.exports = {
  checkPort,
  scanPorts,
  parsePorts,
  COMMON_PORTS
};
