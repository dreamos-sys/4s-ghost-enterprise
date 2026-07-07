const API_BASE = 'https://4s-ghost-api.dreamos-sys.workers.dev';

export async function scanPort(target) {
  try {
    const res = await fetch(`${API_BASE}/api/scanner/port?target=${target}`);
    return await res.json();
  } catch(e) {
    return { error: 'Backend offline', ports: [{port:80,status:'open'}] };
  }
}

export async function whoisLookup(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/whois?domain=${domain}`);
    return await res.json();
  } catch(e) {
    return { error: 'Backend offline', domain };
  }
}

export async function dnsScan(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/dns?domain=${domain}`);
    return await res.json();
  } catch(e) {
    return { error: 'Backend offline', domain };
  }
}

export async function checkSSL(domain) {
  try {
    const res = await fetch(`${API_BASE}/api/ssl?domain=${domain}`);
    return await res.json();
  } catch(e) {
    return { error: 'Backend offline', domain };
  }
}
