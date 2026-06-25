const { getDb, saveDatabase } = require('../../db/database');

// Known bot User-Agent patterns
const BOT_PATTERNS = {
  search_engines: [
    /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
    /baiduspider/i, /yandexbot/i, /sogou/i, /exabot/i
  ],
  social_media: [
    /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
    /pinterest/i, /whatsapp/i, /telegrambot/i
  ],
  monitoring: [
    /pingdom/i, /uptimerobot/i, /newrelicpinger/i,
    /statuscake/i, /gtmetrix/i, /pagespeed/i
  ],
  scrapers: [
    /wget/i, /curl/i, /httpclient/i, /python-requests/i,
    /java\//i, /perl/i, /ruby/i, /php\//i, /go-http/i
  ],
  headless_browsers: [
    /headlesschrome/i, /phantomjs/i, /selenium/i,
    /puppeteer/i, /playwright/i, /electron/i
  ],
  malicious: [
    /nikto/i, /sqlmap/i, /nmap/i, /masscan/i,
    /zgrab/i, /nuclei/i, /burpsuite/i, /acunetix/i
  ]
};

// Suspicious headers
const SUSPICIOUS_HEADERS = [
  'x-puppeteer', 'x-selenium', 'x-playwright',
  'x-phantomjs', 'x-headless'
];

// Browser fingerprinting checks
const BROWSER_CHECKS = {
  webdriver: 'navigator.webdriver',
  languages: 'navigator.languages.length',
  plugins: 'navigator.plugins.length',
  chrome: 'window.chrome',
  permissions: 'navigator.permissions'
};

function analyzeUserAgent(ua) {
  const results = {
    isBot: false,
    category: 'human',
    confidence: 0,
    details: []
  };

  if (!ua || ua.length < 10) {
    results.isBot = true;
    results.category = 'suspicious';
    results.confidence = 80;
    results.details.push('Empty or too short User-Agent');
    return results;
  }

  // Check each category
  for (const [category, patterns] of Object.entries(BOT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(ua)) {
        results.isBot = true;
        results.category = category;
        results.confidence = 95;
        results.details.push(`Matched ${category} pattern: ${pattern.source}`);
        return results;
      }
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /bot/i, category: 'generic_bot' },
    { pattern: /crawler/i, category: 'crawler' },
    { pattern: /spider/i, category: 'spider' },
    { pattern: /scraper/i, category: 'scraper' }
  ];

  for (const { pattern, category } of suspiciousPatterns) {
    if (pattern.test(ua)) {
      results.isBot = true;
      results.category = category;
      results.confidence = 70;
      results.details.push(`Contains suspicious word: ${pattern.source}`);
      return results;
    }
  }

  return results;
}

function analyzeHeaders(headers) {
  const suspicious = [];
  
  for (const header of SUSPICIOUS_HEADERS) {
    if (headers[header]) {
      suspicious.push({
        header,
        value: headers[header],
        reason: 'Headless browser indicator'
      });
    }
  }

  // Check for missing common headers
  const requiredHeaders = ['accept', 'accept-language', 'accept-encoding'];
  for (const header of requiredHeaders) {
    if (!headers[header]) {
      suspicious.push({
        header,
        value: 'missing',
        reason: 'Missing standard browser header'
      });
    }
  }

  return suspicious;
}

function analyzeBehavior(metrics) {
  const issues = [];
  
  // Check timing patterns
  if (metrics.requestInterval && metrics.requestInterval < 100) {
    issues.push({
      type: 'timing',
      severity: 'high',
      message: `Very fast requests: ${metrics.requestInterval}ms interval`
    });
  }

  // Check mouse/keyboard activity
  if (metrics.mouseMovements !== undefined && metrics.mouseMovements < 5) {
    issues.push({
      type: 'interaction',
      severity: 'medium',
      message: `Low mouse activity: ${metrics.mouseMovements} movements`
    });
  }

  // Check page load time
  if (metrics.pageLoadTime && metrics.pageLoadTime < 500) {
    issues.push({
      type: 'performance',
      severity: 'medium',
      message: `Suspiciously fast page load: ${metrics.pageLoadTime}ms`
    });
  }

  return issues;
}

function analyzeRequest(req, metrics = {}) {
  const ua = req.headers['user-agent'] || '';
  const headers = req.headers;

  const uaAnalysis = analyzeUserAgent(ua);
  const headerIssues = analyzeHeaders(headers);
  const behaviorIssues = analyzeBehavior(metrics);

  const totalScore = calculateBotScore(uaAnalysis, headerIssues, behaviorIssues);

  return {
    userAgent: ua,
    ip: req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress,
    timestamp: new Date().toISOString(),
    analysis: {
      userAgent: uaAnalysis,
      headers: headerIssues,
      behavior: behaviorIssues
    },
    botScore: totalScore,
    verdict: getVerdict(totalScore),
    recommendation: getRecommendation(totalScore)
  };
}

function calculateBotScore(uaAnalysis, headerIssues, behaviorIssues) {
  let score = 0;

  // UA analysis (max 50 points)
  if (uaAnalysis.isBot) {
    score += uaAnalysis.confidence * 0.5;
  }

  // Header issues (max 30 points)
  score += Math.min(headerIssues.length * 10, 30);

  // Behavior issues (max 20 points)
  for (const issue of behaviorIssues) {
    if (issue.severity === 'high') score += 10;
    else if (issue.severity === 'medium') score += 5;
    else score += 2;
  }

  return Math.min(Math.round(score), 100);
}

function getVerdict(score) {
  if (score >= 80) return 'definitely_bot';
  if (score >= 60) return 'likely_bot';
  if (score >= 40) return 'suspicious';
  if (score >= 20) return 'possibly_bot';
  return 'human';
}

function getRecommendation(score) {
  if (score >= 80) return 'Block immediately';
  if (score >= 60) return 'Require CAPTCHA';
  if (score >= 40) return 'Monitor closely';
  if (score >= 20) return 'Allow with rate limiting';
  return 'Allow';
}

function logDetection(result) {
  const db = getDb();
  try {
    db.run(
      'INSERT INTO honeypot_logs (ip, user_agent, method, path, attack_type, payload, headers) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        result.ip,
        result.userAgent,
        'ANALYSIS',
        '/api/botdetector/analyze',
        'bot_detection',
        JSON.stringify(result.analysis),
        JSON.stringify({ botScore: result.botScore, verdict: result.verdict })
      ]
    );
    saveDatabase();
  } catch (err) {
    console.error('Failed to log bot detection:', err.message);
  }
}

module.exports = { analyzeRequest, analyzeUserAgent, logDetection, BOT_PATTERNS };
