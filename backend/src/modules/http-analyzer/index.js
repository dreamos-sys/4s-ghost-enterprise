const https = require('https');
const http = require('http');

async function analyzeHeaders(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    // Clean URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    const protocol = targetUrl.startsWith('https') ? https : http;
    
    const req = protocol.get(targetUrl, {
      headers: {
        'User-Agent': '4S-Ghost-Security-Scanner/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      const lookupTime = Date.now() - startTime;
      const headers = res.headers;
      
      // Analyze security headers
      const analysis = {
        hsts: analyzeHSTS(headers['strict-transport-security']),
        csp: analyzeCSP(headers['content-security-policy']),
        xFrame: analyzeXFrame(headers['x-frame-options']),
        xContentType: analyzeXContentType(headers['x-content-type-options']),
        xXSS: analyzeXXSS(headers['x-xss-protection']),
        referrer: analyzeReferrer(headers['referrer-policy']),
        permissions: analyzePermissions(headers['permissions-policy'] || headers['feature-policy']),
        cors: analyzeCORS(headers),
        cacheControl: headers['cache-control'] || null,
        server: headers['server'] || null,
        poweredBy: headers['x-powered-by'] || null
      };
      
      // Calculate security score
      let score = 100;
      const missing = [];
      const warnings = [];
      
      if (!analysis.hsts.present) { score -= 15; missing.push('HSTS'); }
      else if (!analysis.hsts.secure) { score -= 5; warnings.push('HSTS configuration weak'); }
      
      if (!analysis.csp.present) { score -= 20; missing.push('CSP'); }
      else if (!analysis.csp.secure) { score -= 10; warnings.push('CSP allows unsafe directives'); }
      
      if (!analysis.xFrame.present) { score -= 10; missing.push('X-Frame-Options'); }
      if (!analysis.xContentType.present) { score -= 10; missing.push('X-Content-Type-Options'); }
      if (!analysis.xXSS.present) { score -= 5; missing.push('X-XSS-Protection'); }
      if (!analysis.referrer.present) { score -= 5; missing.push('Referrer-Policy'); }
      
      if (analysis.poweredBy) {
        score -= 5;
        warnings.push('X-Powered-By header exposes server technology');
      }
      
      if (analysis.server && analysis.server.match(/apache|nginx|iis|express/i)) {
        score -= 2;
        warnings.push('Server header exposes web server software');
      }
      
      score = Math.max(0, score);
      
      const grade = score >= 90 ? 'A' :
                    score >= 80 ? 'B' :
                    score >= 70 ? 'C' :
                    score >= 60 ? 'D' : 'F';
      
      resolve({
        url: targetUrl,
        statusCode: res.statusCode,
        lookupTime,
        headers: Object.entries(headers).map(([key, value]) => ({
          name: key,
          value: Array.isArray(value) ? value.join(', ') : value
        })),
        analysis,
        score,
        grade,
        missing,
        warnings,
        totalHeaders: Object.keys(headers).length
      });
    });
    
    req.on('error', (err) => {
      reject(new Error('Connection failed: ' + err.message));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

function analyzeHSTS(value) {
  if (!value) return { present: false, secure: false, value: null };
  
  const maxAgeMatch = value.match(/max-age=(\d+)/);
  const includeSubdomains = value.includes('includeSubDomains');
  const preload = value.includes('preload');
  
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;
  const secure = maxAge >= 31536000 && includeSubdomains; // At least 1 year
  
  return {
    present: true,
    secure,
    value,
    maxAge,
    maxAgeDays: Math.floor(maxAge / 86400),
    includeSubdomains,
    preload
  };
}

function analyzeCSP(value) {
  if (!value) return { present: false, secure: false, value: null, directives: {} };
  
  const directives = {};
  value.split(';').forEach(dir => {
    const parts = dir.trim().split(/\s+/);
    if (parts[0]) {
      directives[parts[0]] = parts.slice(1).join(' ');
    }
  });
  
  const hasUnsafeInline = value.includes("'unsafe-inline'");
  const hasUnsafeEval = value.includes("'unsafe-eval'");
  const hasWildcard = value.includes('*');
  
  const secure = !hasUnsafeInline && !hasUnsafeEval && !hasWildcard;
  
  return {
    present: true,
    secure,
    value,
    directives,
    hasUnsafeInline,
    hasUnsafeEval,
    hasWildcard
  };
}

function analyzeXFrame(value) {
  if (!value) return { present: false, secure: false, value: null };
  const secure = value.toUpperCase() === 'DENY' || value.toUpperCase() === 'SAMEORIGIN';
  return { present: true, secure, value };
}

function analyzeXContentType(value) {
  if (!value) return { present: false, secure: false, value: null };
  const secure = value.toLowerCase() === 'nosniff';
  return { present: true, secure, value };
}

function analyzeXXSS(value) {
  if (!value) return { present: false, secure: false, value: null };
  const secure = value === '1; mode=block';
  return { present: true, secure, value };
}

function analyzeReferrer(value) {
  if (!value) return { present: false, secure: false, value: null };
  const secureValues = ['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'];
  const secure = secureValues.includes(value.toLowerCase());
  return { present: true, secure, value };
}

function analyzePermissions(value) {
  if (!value) return { present: false, secure: false, value: null };
  return { present: true, secure: true, value };
}

function analyzeCORS(headers) {
  const origin = headers['access-control-allow-origin'];
  const credentials = headers['access-control-allow-credentials'];
  
  if (!origin) return { present: false, secure: true, wildcard: false };
  
  const wildcard = origin === '*';
  const secure = !wildcard || !credentials;
  
  return {
    present: true,
    secure,
    wildcard,
    origin,
    credentials: credentials === 'true'
  };
}

module.exports = { analyzeHeaders };
