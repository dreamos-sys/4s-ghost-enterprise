const { getDb } = require('../../db/database');

// Threat intelligence database (IP reputation)
const threatIntel = {
  knownMalicious: [
    '192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.42'
  ],
  knownScanners: [
    'shodan.io', 'censys.io', 'binaryedge.io'
  ]
};

// Risk weights for different signals
const RISK_WEIGHTS = {
  honeypot_attacks: 0.30,
  rate_limit_blocks: 0.25,
  bot_score: 0.20,
  attack_severity: 0.15,
  ip_reputation: 0.10
};

// Analyze IP threat level
function analyzeIP(ip) {
  const db = getDb();
  
  // Get honeypot attacks from this IP
  const honeypot = db.exec(`
    SELECT COUNT(*) as total,
           COUNT(DISTINCT attack_type) as types,
           MAX(created_at) as last_seen
    FROM honeypot_logs WHERE ip = ?
  `, [ip]);
  
  const honeypotData = honeypot[0]?.values[0] || [0, 0, null];
  const [totalAttacks, uniqueTypes, lastSeen] = honeypotData;
  
  // Get attack types breakdown
  const attackTypes = db.exec(`
    SELECT attack_type, COUNT(*) as count
    FROM honeypot_logs WHERE ip = ?
    GROUP BY attack_type
  `, [ip]);
  
  const typeBreakdown = attackTypes[0]?.values.map(v => ({
    type: v[0],
    count: v[1]
  })) || [];
  
  // Calculate threat score
  let threatScore = 0;
  
  // Base score from attack count
  threatScore += Math.min(totalAttacks * 5, 40);
  
  // Bonus for diverse attack types
  threatScore += uniqueTypes * 10;
  
  // Bonus for critical attack types
  const criticalTypes = ['sqli', 'xss', 'traversal'];
  const hasCritical = typeBreakdown.some(t => criticalTypes.includes(t.type));
  if (hasCritical) threatScore += 20;
  
  // IP reputation check
  if (threatIntel.knownMalicious.includes(ip)) {
    threatScore += 30;
  }
  
  threatScore = Math.min(threatScore, 100);
  
  return {
    ip,
    threatScore: Math.round(threatScore),
    riskLevel: getRiskLevel(threatScore),
    totalAttacks,
    uniqueAttackTypes: uniqueTypes,
    attackBreakdown: typeBreakdown,
    lastSeen,
    isKnownMalicious: threatIntel.knownMalicious.includes(ip),
    recommendation: getRecommendation(threatScore, typeBreakdown)
  };
}

function getRiskLevel(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'low';
  return 'safe';
}

function getRecommendation(score, attackTypes) {
  if (score >= 80) {
    return {
      action: 'BLOCK_IMMEDIATELY',
      reason: 'Critical threat detected - immediate action required',
      steps: [
        'Add IP to firewall blocklist',
        'Enable enhanced monitoring',
        'Alert security team',
        'Review all requests from this IP'
      ]
    };
  }
  if (score >= 60) {
    return {
      action: 'RATE_LIMIT_AND_MONITOR',
      reason: 'High risk - aggressive monitoring needed',
      steps: [
        'Apply strict rate limiting',
        'Enable CAPTCHA challenges',
        'Log all activity',
        'Consider temporary block'
      ]
    };
  }
  if (score >= 40) {
    return {
      action: 'ENHANCED_MONITORING',
      reason: 'Medium risk - keep watch',
      steps: [
        'Increase logging verbosity',
        'Monitor for escalation',
        'Apply standard rate limits'
      ]
    };
  }
  if (score >= 20) {
    return {
      action: 'STANDARD_MONITORING',
      reason: 'Low risk - normal operations',
      steps: ['Standard monitoring is sufficient']
    };
  }
  return {
    action: 'ALLOW',
    reason: 'No significant threats detected',
    steps: ['No action required']
  };
}

// Global threat analysis
function getThreatLandscape() {
  const db = getDb();
  
  // Overall stats
  const totalAttacks = db.exec('SELECT COUNT(*) FROM honeypot_logs');
  const uniqueIPs = db.exec('SELECT COUNT(DISTINCT ip) FROM honeypot_logs');
  const attackTypes = db.exec(`
    SELECT attack_type, COUNT(*) as count
    FROM honeypot_logs
    GROUP BY attack_type
    ORDER BY count DESC
  `);
  
  // Top threats
  const topThreats = db.exec(`
    SELECT ip, COUNT(*) as attacks,
           COUNT(DISTINCT attack_type) as types
    FROM honeypot_logs
    GROUP BY ip
    ORDER BY attacks DESC
    LIMIT 10
  `);
  
  // Recent activity (last 24h)
  const recentActivity = db.exec(`
    SELECT 
      strftime('%Y-%m-%d %H:00', created_at) as hour,
      COUNT(*) as attacks
    FROM honeypot_logs
    WHERE created_at >= datetime('now', '-24 hours')
    GROUP BY hour
    ORDER BY hour
  `);
  
  // Calculate overall threat score
  const total = totalAttacks[0]?.values[0][0] || 0;
  const unique = uniqueIPs[0]?.values[0][0] || 0;
  
  let globalScore = 0;
  globalScore += Math.min(total * 2, 40);
  globalScore += Math.min(unique * 5, 30);
  
  // Bonus for diverse attack vectors
  const numTypes = attackTypes[0]?.values.length || 0;
  globalScore += numTypes * 5;
  
  globalScore = Math.min(globalScore, 100);
  
  // Analyze top IPs
  const analyzedIPs = (topThreats[0]?.values || []).map(row => {
    const [ip, attacks, types] = row;
    return analyzeIP(ip);
  });
  
  // Predictive alerts
  const alerts = generateAlerts(analyzedIPs, total, attackTypes[0]?.values || []);
  
  return {
    globalThreatScore: Math.round(globalScore),
    globalRiskLevel: getRiskLevel(globalScore),
    stats: {
      totalAttacks: total,
      uniqueAttackers: unique,
      attackVectors: numTypes
    },
    attackDistribution: (attackTypes[0]?.values || []).map(v => ({
      type: v[0],
      count: v[1],
      percentage: total > 0 ? Math.round((v[1] / total) * 100) : 0
    })),
    topThreats: analyzedIPs,
    recentActivity: (recentActivity[0]?.values || []).map(v => ({
      hour: v[0],
      attacks: v[1]
    })),
    alerts,
    aiInsights: generateInsights(analyzedIPs, attackTypes[0]?.values || [])
  };
}

function generateAlerts(analyzedIPs, totalAttacks, attackTypes) {
  const alerts = [];
  
  // Critical IP alerts
  const criticalIPs = analyzedIPs.filter(ip => ip.threatScore >= 80);
  if (criticalIPs.length > 0) {
    alerts.push({
      type: 'critical',
      icon: '🚨',
      title: `${criticalIPs.length} Critical Threat(s) Detected`,
      message: `IPs require immediate blocking: ${criticalIPs.map(ip => ip.ip).join(', ')}`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Attack spike alert
  if (totalAttacks > 50) {
    alerts.push({
      type: 'warning',
      icon: '⚠️',
      title: 'High Attack Volume',
      message: `${totalAttacks} attacks detected - consider enabling DDoS protection`,
      timestamp: new Date().toISOString()
    });
  }
  
  // SQL injection campaign
  const sqliAttacks = attackTypes.find(t => t[0] === 'sqli');
  if (sqliAttacks && sqliAttacks[1] > 5) {
    alerts.push({
      type: 'warning',
      icon: '🗄️',
      title: 'SQL Injection Campaign Detected',
      message: `${sqliAttacks[1]} SQLi attempts - review database security`,
      timestamp: new Date().toISOString()
    });
  }
  
  // XSS campaign
  const xssAttacks = attackTypes.find(t => t[0] === 'xss');
  if (xssAttacks && xssAttacks[1] > 5) {
    alerts.push({
      type: 'warning',
      icon: '💉',
      title: 'XSS Campaign Detected',
      message: `${xssAttacks[1]} XSS attempts - review input validation`,
      timestamp: new Date().toISOString()
    });
  }
  
  // All clear
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      icon: '✅',
      title: 'System Secure',
      message: 'No significant threats detected at this time',
      timestamp: new Date().toISOString()
    });
  }
  
  return alerts;
}

function generateInsights(analyzedIPs, attackTypes) {
  const insights = [];
  
  // Most common attack vector
  if (attackTypes.length > 0) {
    const topAttack = attackTypes[0];
    insights.push({
      type: 'pattern',
      icon: '🎯',
      text: `Most common attack vector: <strong>${topAttack[0].toUpperCase()}</strong> (${topAttack[1]} attempts)`,
      action: `Strengthen ${topAttack[0]} defenses`
    });
  }
  
  // Persistent attacker
  const persistent = analyzedIPs.find(ip => ip.totalAttacks > 10);
  if (persistent) {
    insights.push({
      type: 'behavior',
      icon: '🎭',
      text: `Persistent attacker detected: <strong>${persistent.ip}</strong> with ${persistent.totalAttacks} attempts`,
      action: 'Consider permanent block'
    });
  }
  
  // Diverse attack patterns
  const diverse = analyzedIPs.find(ip => ip.uniqueAttackTypes >= 3);
  if (diverse) {
    insights.push({
      type: 'sophistication',
      icon: '🧠',
      text: `Sophisticated attacker using ${diverse.uniqueAttackTypes} different attack vectors`,
      action: 'Enable advanced threat detection'
    });
  }
  
  return insights;
}

// Predict future threats (simple ML-like prediction)
function predictThreats() {
  const db = getDb();
  
  // Analyze patterns from last 7 days
  const patterns = db.exec(`
    SELECT 
      attack_type,
      COUNT(*) as frequency,
      COUNT(DISTINCT ip) as unique_ips
    FROM honeypot_logs
    WHERE created_at >= datetime('now', '-7 days')
    GROUP BY attack_type
  `);
  
  const predictions = (patterns[0]?.values || []).map(row => {
    const [type, frequency, uniqueIPs] = row;
    
    // Simple prediction: if frequency is high, predict continuation
    const confidence = Math.min((frequency / 10) * 100, 95);
    const expectedAttacks = Math.round(frequency * 1.2); // 20% increase expected
    
    return {
      attackType: type,
      confidence: Math.round(confidence),
      expectedFrequency: expectedAttacks,
      affectedIPs: uniqueIPs,
      recommendation: `Prepare for ${expectedAttacks} ${type} attacks in next period`
    };
  });
  
  return predictions.sort((a, b) => b.confidence - a.confidence);
}

module.exports = {
  analyzeIP,
  getThreatLandscape,
  predictThreats,
  getRiskLevel
};
