const XSS_PATTERNS = [
  { name: 'Script Tag', regex: '<script\\b[^>]*>', severity: 'critical', description: 'Direct script tag' },
  { name: 'Inline Event', regex: 'on\\w+\\s*=', severity: 'high', description: 'Inline event handler' },
  { name: 'JavaScript Protocol', regex: 'javascript:', severity: 'high', description: 'JavaScript protocol in URL' },
  { name: 'Data URI', regex: 'data:text/html', severity: 'high', description: 'Data URI with HTML' },
  { name: 'Iframe', regex: '<iframe\\b', severity: 'medium', description: 'Iframe injection' },
  { name: 'Object Tag', regex: '<object\\b', severity: 'medium', description: 'Object tag' },
  { name: 'Embed Tag', regex: '<embed\\b', severity: 'medium', description: 'Embed tag' },
  { name: 'SVG', regex: '<svg\\b', severity: 'high', description: 'SVG tag (potential XSS)' }
];

function scanContent(content) {
  const findings = [];
  XSS_PATTERNS.forEach(pattern => {
    try {
      const regex = new RegExp(pattern.regex, 'gi');
      const matches = content.match(regex);
      if (matches) {
        matches.forEach(match => {
          const lines = content.substring(0, content.indexOf(match)).split('\n');
          findings.push({
            pattern: pattern.name,
            match: match.substring(0, 200),
            severity: pattern.severity,
            description: pattern.description,
            line: lines.length
          });
        });
      }
    } catch (e) {
      console.error('Pattern error:', pattern.name, e.message);
    }
  });

  return {
    totalFindings: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
    findings
  };
}

async function scanURL(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': '4S-Ghost-XSS-Scanner/1.0' }
    });
    const html = await response.text();
    const scanResult = scanContent(html);
    return { url, status: response.status, contentLength: html.length, ...scanResult };
  } catch (error) {
    throw new Error('Failed to fetch URL: ' + error.message);
  }
}

module.exports = { scanContent, scanURL, XSS_PATTERNS };
