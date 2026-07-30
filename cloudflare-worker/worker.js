export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    try {
      // ====== WHOIS (RDAP) ======
      if (path === '/api/whois') {
        const domain = url.searchParams.get('domain') || 'example.com';
        try {
          const rdapRes = await fetch(`https://rdap.org/domain/${domain}`, {
            headers: { 'Accept': 'application/json', 'User-Agent': '4S-Ghost-Enterprise/2.0' }
          });
          if (!rdapRes.ok) throw new Error(`RDAP lookup failed with status ${rdapRes.status}`);
          const data = await rdapRes.json();
          return new Response(JSON.stringify({
            domain,
            registrar: data.registrar?.name || data.registrant?.name || 'Unknown',
            nameservers: data.nameservers?.map(n => n.ldhName) || [],
            status: data.status || [],
            lastUpdated: data.events?.find(e => e.eventAction === 'last update of RDAP database')?.eventDate || null
          }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ domain, error: `Could not fetch WHOIS data: ${e.message}` }), { status: 502, headers });
        }
      }

      // ====== DNS (Cloudflare DNS) ======
      if (path === '/api/dns') {
        const domain = url.searchParams.get('domain') || 'example.com';
        try {
          const [aRes, mxRes, txtRes] = await Promise.all([
            fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, { headers: { 'Accept': 'application/dns-json' } }),
            fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, { headers: { 'Accept': 'application/dns-json' } }),
            fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`, { headers: { 'Accept': 'application/dns-json' } })
          ]);
          const [aData, mxData, txtData] = await Promise.all([aRes.json(), mxRes.json(), txtRes.json()]);
          return new Response(JSON.stringify({
            domain,
            records: {
              A: aData.Answer?.map(r => r.data) || [],
              MX: mxData.Answer?.map(r => `${r.data.split(' ')[1]} (priority ${r.data.split(' ')[0]})`) || [],
              TXT: txtData.Answer?.map(r => r.data.replace(/"/g, '')) || []
            }
          }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ domain, error: 'Could not fetch DNS records' }), { status: 502, headers });
        }
      }

      // ====== SSL (SSL Labs) ======
      if (path === '/api/ssl') {
        const domain = url.searchParams.get('domain') || 'example.com';
        try {
          const sslRes = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}&fromCache=on&maxAge=24`, {
            headers: { 'Accept': 'application/json' }
          });
          const data = await sslRes.json();
          const endpoint = data.endpoints?.[0];
          return new Response(JSON.stringify({
            domain,
            grade: endpoint?.grade || 'N/A',
            hasWarnings: endpoint?.hasWarnings || false,
            isExceptional: endpoint?.isExceptional || false,
            issuer: endpoint?.details?.cert?.issuer || 'Unknown',
            validFrom: endpoint?.details?.cert?.validFrom || null,
            validTo: endpoint?.details?.cert?.validTo || null
          }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ domain, error: 'Could not fetch SSL data' }), { status: 502, headers });
        }
      }

      // ====== BOT DETECT (Analisis User-Agent & Header) ======
      if (path === '/api/botdetect') {
        const ua = request.headers.get('User-Agent') || '';
        const ip = request.headers.get('CF-Connecting-IP') || 'Unknown';
        const botPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /selenium/i, /headless/i];
        const isBot = botPatterns.some(pattern => pattern.test(ua));
        return new Response(JSON.stringify({
          ip,
          userAgent: ua,
          isBot,
          confidence: isBot ? 'High' : 'Low',
          detectionMethod: 'User-Agent & IP analysis',
          timestamp: new Date().toISOString()
        }), { headers });
      }

      // ====== XSS SCANNER (Simulasi Reflektif) ======
      if (path === '/api/xss') {
        const target = url.searchParams.get('target') || 'http://testphp.vulnweb.com/search.php?test=query';
        // Simulasi: kirim payload sederhana dan analisis respons
        const payload = '<script>alert(1)</script>';
        try {
          const testRes = await fetch(target + encodeURIComponent(payload), { headers: { 'User-Agent': '4S-Ghost-XSS-Scanner' } });
          const body = await testRes.text();
          const reflected = body.includes(payload);
          return new Response(JSON.stringify({
            target,
            vulnerable: reflected,
            payload,
            method: 'GET',
            note: reflected ? 'Potentially vulnerable to reflected XSS' : 'No immediate reflection detected',
            timestamp: new Date().toISOString()
          }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ target, error: 'Could not test target' }), { status: 502, headers });
        }
      }

      // ====== JWT DECODER ======
      if (path === '/api/jwt' && request.method === 'POST') {
        try {
          const { token } = await request.json();
          if (!token) throw new Error('No token provided');
          const parts = token.split('.');
          if (parts.length !== 3) throw new Error('Invalid JWT format');
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          return new Response(JSON.stringify({ header, payload, signature: parts[2] }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: 400, headers });
        }
      }

      // ====== HONEYPOT (Trap Data) ======
      if (path === '/api/honeypot') {
        // Simulasi data honeypot: catat percobaan akses
        const attempt = {
          ip: request.headers.get('CF-Connecting-IP') || 'Unknown',
          path: url.searchParams.get('path') || '/admin',
          method: request.method,
          timestamp: new Date().toISOString(),
          action: 'Logged attempt'
        };
        // Dalam produksi, simpan ke database
        return new Response(JSON.stringify({
          honeypot: 'active',
          recentAttempts: [attempt],
          totalAttempts: Math.floor(Math.random() * 100) + 1
        }), { headers });
      }

      // ====== FORENSIC (Log Analysis) ======
      if (path === '/api/forensic') {
        const sampleLogs = [
          { timestamp: new Date().toISOString(), event: 'Failed login attempt', source: '192.168.1.100', user: 'admin' },
          { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'File modified', source: 'internal', file: '/etc/config' },
          { timestamp: new Date(Date.now() - 7200000).toISOString(), event: 'New connection', source: '10.0.0.1', port: 443 }
        ];
        return new Response(JSON.stringify({
          analyzedLogs: sampleLogs,
          suspiciousActivities: 1,
          recommendation: 'Review failed login attempts and verify file integrity.'
        }), { headers });
      }

      // ====== DEFENSE SHIELD ======
      if (path === '/api/defense') {
        return new Response(JSON.stringify({
          status: 'active',
          threatsBlocked: Math.floor(Math.random() * 500),
          lastAttack: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          rules: ['SQL Injection', 'XSS', 'CSRF', 'Brute Force'],
          firewall: 'Enabled'
        }), { headers });
      }

      // ====== RATE LIMITER ======
      if (path === '/api/ratelimit') {
        return new Response(JSON.stringify({
          currentRPS: Math.floor(Math.random() * 100),
          limit: 100,
          status: 'within limits',
          burst: Math.floor(Math.random() * 50)
        }), { headers });
      }

      // ====== DREAM OS MONITOR ======
      if (path === '/api/dreamos') {
        return new Response(JSON.stringify({
          version: '2.0.0',
          uptime: Math.floor(process.uptime()),
          memory: process.memoryUsage ? process.memoryUsage().rss / 1024 / 1024 : 'N/A',
          cpu: '0.5%'
        }), { headers });
      }

      // ====== SECURITY AUDIT ======
      if (path === '/api/audit') {
        return new Response(JSON.stringify({
          score: 85,
          findings: [
            { severity: 'high', issue: 'Weak TLS 1.0 enabled' },
            { severity: 'medium', issue: 'Missing security headers' }
          ],
          recommendations: ['Disable TLS 1.0', 'Add HSTS header']
        }), { headers });
      }

      // ====== PORT SCANNER (tetap simulasi) ======
      if (path === '/api/scanner/port') {
        const target = url.searchParams.get('target') || 'localhost';
        return new Response(JSON.stringify({
          target,
          ports: [
            { port: 22, status: 'filtered' },
            { port: 80, status: 'open' },
            { port: 443, status: 'open' },
            { port: 3306, status: 'closed' },
            { port: 8080, status: 'open' }
          ],
          note: 'Port scanning from serverless environment is simulated. Use internal scanner for real results.'
        }), { headers });
      }

      // Endpoint status
      if (path === '/api/status') {
        return new Response(JSON.stringify({ status: 'online', version: '2.0.0', workers: true }), { headers });
      }

      return new Response(JSON.stringify({ error: 'Route not found', path }), { headers, status: 404 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { headers, status: 500 });
    }
  }
};
