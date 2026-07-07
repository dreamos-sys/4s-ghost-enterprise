const API_BASE = 'https://4s-ghost-api.dreamos-sys.workers.dev';

export async function scanPort(target) {
  try {
    const res = await fetch(`${API_BASE}/api/scanner/port?target=${encodeURIComponent(target)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline - using fallback', ports: [
      { port: 22, status: 'filtered' },
      { port: 80, status: 'open' },
      { port: 443, status: 'open' }
    ]};
  }
}

export async function whoisLookup(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/whois?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline - using fallback', domain, registrar: 'Unknown' };
  }
}

export async function dnsScan(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/dns?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline - using fallback', domain, records: [] };
  }
}

export async function checkSSL(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/ssl?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    return data;
  } catch(e) {
    return { error: 'Backend offline - using fallback', domain, grade: 'N/A' };
  }
}
