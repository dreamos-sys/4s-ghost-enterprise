const https = require('https');
const tls = require('tls');
const { URL } = require('url');

async function checkCertificate(domain, port = 443) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const options = {
      host: domain,
      port: port,
      servername: domain,
      rejectUnauthorized: false
    };

    const req = https.get(options, (res) => {
      const cert = res.socket.getPeerCertificate(true);
      const lookupTime = Date.now() - startTime;

      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
        return;
      }

      const now = new Date();
      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      
      const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
      const daysSinceIssued = Math.floor((now - validFrom) / (1000 * 60 * 60 * 24));
      const totalValidDays = Math.floor((validTo - validFrom) / (1000 * 60 * 60 * 24));

      // Parse certificate chain
      const chain = [];
      let currentCert = cert;
      while (currentCert) {
        chain.push({
          subject: currentCert.subject?.CN || currentCert.subject?.O || 'Unknown',
          issuer: currentCert.issuer?.CN || currentCert.issuer?.O || 'Unknown',
          validFrom: currentCert.valid_from,
          validTo: currentCert.valid_to,
          fingerprint: currentCert.fingerprint256 || currentCert.fingerprint,
          serialNumber: currentCert.serialNumber
        });
        currentCert = currentCert.issuerCertificate;
        if (currentCert === cert) break; // Self-signed loop
      }

      // Security analysis
      const security = {
        isValid: now >= validFrom && now <= validTo,
        isExpired: now > validTo,
        isNotYetValid: now < validFrom,
        daysUntilExpiry,
        isExpiringSoon: daysUntilExpiry <= 30,
        isExpiringCritical: daysUntilExpiry <= 7,
        protocol: res.socket.getProtocol() || 'Unknown',
        cipher: res.socket.getCipher() || null,
        hasStrongCipher: false,
        supportsHSTS: res.headers['strict-transport-security'] !== undefined,
        hstsMaxAge: null
      };

      // Parse HSTS
      if (security.supportsHSTS) {
        const hstsHeader = res.headers['strict-transport-security'];
        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          security.hstsMaxAge = parseInt(maxAgeMatch[1]);
        }
      }

      // Check cipher strength
      if (security.cipher) {
        const strongCiphers = ['AES256', 'AES128', 'CHACHA20'];
        security.hasStrongCipher = strongCiphers.some(c => 
          security.cipher.name.toUpperCase().includes(c)
        );
      }

      // Calculate security score
      let score = 100;
      if (security.isExpired) score -= 50;
      if (security.isExpiringCritical) score -= 30;
      else if (security.isExpiringSoon) score -= 15;
      if (!security.hasStrongCipher) score -= 10;
      if (!security.supportsHSTS) score -= 10;
      if (chain.length < 2) score -= 5; // Incomplete chain

      score = Math.max(0, score);

      const grade = score >= 90 ? 'A' : 
                    score >= 80 ? 'B' : 
                    score >= 70 ? 'C' : 
                    score >= 60 ? 'D' : 'F';

      resolve({
        domain,
        port,
        lookupTime,
        certificate: {
          subject: {
            commonName: cert.subject?.CN || 'Unknown',
            organization: cert.subject?.O || 'Unknown',
            organizationalUnit: cert.subject?.OU || 'Unknown',
            locality: cert.subject?.L || 'Unknown',
            state: cert.subject?.ST || 'Unknown',
            country: cert.subject?.C || 'Unknown'
          },
          issuer: {
            commonName: cert.issuer?.CN || 'Unknown',
            organization: cert.issuer?.O || 'Unknown',
            country: cert.issuer?.C || 'Unknown'
          },
          validity: {
            notBefore: cert.valid_from,
            notAfter: cert.valid_to,
            daysSinceIssued,
            daysUntilExpiry,
            totalValidDays
          },
          technical: {
            serialNumber: cert.serialNumber,
            fingerprint: cert.fingerprint,
            fingerprint256: cert.fingerprint256,
            publicKey: {
              algorithm: cert.pubkey?.alg || cert.asn1Curve || 'Unknown',
              size: cert.bits || 'Unknown'
            }
          },
          san: cert.subjectaltname ? cert.subjectaltname.split(', ').map(s => s.replace('DNS:', '')) : [],
          chain
        },
        security,
        score,
        grade,
        recommendations: generateRecommendations(security, chain, cert)
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Connection timeout'));
    });

    req.end();
  });
}

function generateRecommendations(security, chain, cert) {
  const recommendations = [];

  if (security.isExpired) {
    recommendations.push({
      severity: 'critical',
      issue: 'Certificate has expired',
      action: 'Renew certificate immediately'
    });
  }

  if (security.isExpiringCritical) {
    recommendations.push({
      severity: 'critical',
      issue: `Certificate expires in ${security.daysUntilExpiry} days`,
      action: 'Renew certificate urgently'
    });
  } else if (security.isExpiringSoon) {
    recommendations.push({
      severity: 'warning',
      issue: `Certificate expires in ${security.daysUntilExpiry} days`,
      action: 'Plan certificate renewal'
    });
  }

  if (!security.supportsHSTS) {
    recommendations.push({
      severity: 'warning',
      issue: 'HSTS not enabled',
      action: 'Add Strict-Transport-Security header'
    });
  } else if (security.hstsMaxAge && security.hstsMaxAge < 31536000) {
    recommendations.push({
      severity: 'info',
      issue: 'HSTS max-age is less than 1 year',
      action: 'Consider increasing max-age to at least 31536000 seconds'
    });
  }

  if (!security.hasStrongCipher) {
    recommendations.push({
      severity: 'warning',
      issue: 'Weak cipher suite detected',
      action: 'Configure server to use strong ciphers (AES256, CHACHA20)'
    });
  }

  if (chain.length < 2) {
    recommendations.push({
      severity: 'warning',
      issue: 'Incomplete certificate chain',
      action: 'Install intermediate certificates'
    });
  }

  if (security.protocol === 'TLSv1' || security.protocol === 'TLSv1.1') {
    recommendations.push({
      severity: 'critical',
      issue: `Outdated protocol: ${security.protocol}`,
      action: 'Upgrade to TLS 1.2 or TLS 1.3'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      severity: 'success',
      issue: 'All checks passed',
      action: 'Certificate configuration is secure'
    });
  }

  return recommendations;
}

module.exports = { checkCertificate };
