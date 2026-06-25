// XSS patterns to detect
const XSS_PATTERNS = [
  {
    name: 'Script Tag',
    pattern: /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    severity: 'critical',
    description: 'Direct script tag injection'
  },
  {
    name: 'Inline Event Handler',
    pattern: /\bon\w+\s*=\s*["'][^"']*["']/gi,
    severity: 'high',
    description: 'Inline event handlers (onclick, onload, etc.)'
  },
  {
    name: 'JavaScript Protocol',
    pattern: /javascript:/gi,
    severity: 'high',
    description: 'JavaScript protocol in URLs'
  },
  {
    name: 'Data URI',
    pattern: /data:text\/html[^,]*,[\s\S]*/gi,
    severity: 'high',
    description: 'Data URI with HTML content'
  },
  {
    name: 'VBScript',
    pattern: /vbscript:/gi,
    severity: 'high',
    description: 'VBScript protocol'
  },
  {
    name: 'Iframe Injection',
    pattern: /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
    severity: 'medium',
    description: 'Iframe injection'
  },
  {
    name: 'Object Tag',
    pattern: /<object\b[^>]*>[\s\S]*?<\/object>/gi,
    severity: 'medium',
    description: 'Object tag injection'
  },
  {
    name: 'Embed Tag',
    pattern: /<embed\b[^>]*>/gi,
    severity: 'medium',
    description: 'Embed tag injection'
  },
  {
    name: 'SVG Script',
    pattern: /<svg[^>]*>[\s\S]*?<script[^>]*>[\s\S]*?<\/script>[\s\S]*?<\/svg>/gi,
    severity: 'critical',
    description: 'SVG with embedded script'
  },
  {
    name: 'MathML Script',
    pattern: /<math[^>]*>[\s\S]*?<script[^>]*>[\s\S]*?<\/script>[\s\S]*?<\/math>/gi,
    severity: 'critical',
    description: 'MathML with embedded script'
  },
  {
    name: 'HTML Entity Bypass',
    pattern: /&#x?[0-9a-f]+;/gi,
    severity: 'low',
    description: 'HTML entity encoding (potential bypass attempt)'
  },
  {
    name: 'Unicode Escape',
    pattern: /\\u[0-9a-f]{4}/gi,
    severity: 'low',
    description: 'Unicode escape sequences'
  }
];

// Scan content for XSS patterns
function scanContent(content) {
  const findings = [];
  
  XSS_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      matches.forEach(match => {
        findings.push({
          pattern: pattern.name,
          match: match.substring(0, 200), // Limit length
          severity: pattern.severity,
          description: pattern.description,
          line: getLineNumber(content, match)
        });
      });
    }
  });
  
  return {
    totalFindings: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
    findings: findings
  };
}

// Get line number of match
function getLineNumber(content, match) {
  const lines = content.substring(0, content.indexOf(match)).split('\n');
  return lines.length;
}

// Fetch and scan URL
async function scanURL(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': '4S-Ghost-XSS-Scanner/1.0'
      },
      timeout: 5000
    });
    
    const html = await response.text();
    const scanResult = scanContent(html);
    
    return {
      url,
      status: response.status,
      contentLength: html.length,
      ...scanResult
    };
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }
}

module.exports = {
  scanContent,
  scanURL,
  XSS_PATTERNS
};
