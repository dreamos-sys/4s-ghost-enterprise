export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };
    
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    try {
      let result;
      
      // === SCANNER ===
      if (path === '/api/scanner/port') {
        const target = url.searchParams.get('target') || 'localhost';
        // Simulasi port scan (karena Cloudflare Workers tidak bisa buka TCP langsung)
        result = {
          target,
          ports: [
            { port: 22, status: 'filtered' },
            { port: 80, status: 'open' },
            { port: 443, status: 'open' },
            { port: 3306, status: 'closed' },
            { port: 8080, status: 'open' }
          ]
        };
      }
      
      // === WHOIS ===
      else if (path === '/api/whois') {
        const domain = url.searchParams.get('domain') || 'example.com';
        result = {
          domain,
          registrar: 'Example Registrar, Inc.',
          created: '2020-01-15',
          expires: '2027-01-15',
          nameServers: ['ns1.dreamhost.com', 'ns2.dreamhost.com']
        };
      }
      
      // === DNS ===
      else if (path === '/api/dns') {
        const domain = url.searchParams.get('domain') || 'example.com';
        result = {
          domain,
          records: [
            { type: 'A', value: '185.199.108.153' },
            { type: 'MX', value: 'mail.example.com' },
            { type: 'TXT', value: 'v=spf1 include:_spf.google.com ~all' },
            { type: 'NS', value: 'ns1.dreamhost.com' }
          ]
        };
      }
      
      // === SSL ===
      else if (path === '/api/ssl') {
        const domain = url.searchParams.get('domain') || 'example.com';
        result = {
          domain,
          issuer: "Let's Encrypt",
          validFrom: '2026-03-15',
          validTo: '2026-09-15',
          grade: 'A+'
        };
      }
      
      // === STATUS ===
      else if (path === '/api/status') {
        result = { status: 'online', version: '1.0.0', workers: true };
      }
      
      else {
        result = { error: 'Route not found', path };
      }
      
      return new Response(JSON.stringify(result, null, 2), { headers, status: 200 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { headers, status: 500 });
    }
  }
};
