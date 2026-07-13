const API_BASE = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || 'http://localhost:3001';

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  return res.json();
}

export async function fetchWhois(domain) {
  const res = await fetch(`${API_BASE}/api/whois?domain=${domain}`);
  return res.json();
}

export async function scanPort(target) {
  const res = await fetch(`${API_BASE}/api/scanner/port?target=${target}`);
  return res.json();
}

export async function fetchDNS(domain) {
  const res = await fetch(`${API_BASE}/api/dns?domain=${domain}`);
  return res.json();
}

export async function fetchSSL(domain) {
  const res = await fetch(`${API_BASE}/api/ssl?domain=${domain}`);
  return res.json();
}
