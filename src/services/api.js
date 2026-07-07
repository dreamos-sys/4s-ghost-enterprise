const API_BASE = 'https://4s-ghost-api.dreamos-sys.workers.dev';

export async function scanPort(target) {
  try {
    const res = await fetch(`${API_BASE}/api/scanner/port?target=${encodeURIComponent(target)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline', ports: [22,80,443].map(p => ({ port: p, status: 'unknown' })) };
  }
}

export async function whoisLookup(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/whois?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline', domain, registrar: 'Unknown', created: 'N/A' };
  }
}

export async function dnsScan(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/dns?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline', domain, records: [] };
  }
}

export async function checkSSL(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/ssl?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline', domain, grade: 'N/A' };
  }
}
