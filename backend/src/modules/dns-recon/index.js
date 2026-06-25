const dns = require('dns').promises;

async function lookupRecords(domain) {
  const startTime = Date.now();
  const results = {
    domain: domain,
    timestamp: new Date().toISOString(),
    records: {
      A: [],
      AAAA: [],
      MX: [],
      TXT: [],
      NS: [],
      CNAME: [],
      SOA: null
    },
    errors: []
  };

  // A records (IPv4)
  try {
    const aRecords = await dns.resolve4(domain);
    results.records.A = aRecords;
  } catch (err) {
    results.errors.push({ type: 'A', message: err.code || err.message });
  }

  // AAAA records (IPv6)
  try {
    const aaaaRecords = await dns.resolve6(domain);
    results.records.AAAA = aaaaRecords;
  } catch (err) {
    if (err.code !== 'ENODATA') {
      results.errors.push({ type: 'AAAA', message: err.code || err.message });
    }
  }

  // MX records (Mail)
  try {
    const mxRecords = await dns.resolveMx(domain);
    results.records.MX = mxRecords.map(mx => ({
      priority: mx.priority,
      exchange: mx.exchange
    }));
  } catch (err) {
    results.errors.push({ type: 'MX', message: err.code || err.message });
  }

  // TXT records
  try {
    const txtRecords = await dns.resolveTxt(domain);
    results.records.TXT = txtRecords.map(txt => txt.join(''));
  } catch (err) {
    results.errors.push({ type: 'TXT', message: err.code || err.message });
  }

  // NS records (Name Servers)
  try {
    const nsRecords = await dns.resolveNs(domain);
    results.records.NS = nsRecords;
  } catch (err) {
    results.errors.push({ type: 'NS', message: err.code || err.message });
  }

  // CNAME records
  try {
    const cnameRecord = await dns.resolveCname(domain);
    results.records.CNAME = cnameRecord;
  } catch (err) {
    if (err.code !== 'ENODATA') {
      results.errors.push({ type: 'CNAME', message: err.code || err.message });
    }
  }

  // SOA record
  try {
    const soaRecord = await dns.resolveSoa(domain);
    results.records.SOA = {
      nsname: soaRecord.nsname,
      hostmaster: soaRecord.hostmaster,
      serial: soaRecord.serial,
      refresh: soaRecord.refresh,
      retry: soaRecord.retry,
      expire: soaRecord.expire,
      minimum: soaRecord.minimum
    };
  } catch (err) {
    results.errors.push({ type: 'SOA', message: err.code || err.message });
  }

  const lookupTime = Date.now() - startTime;

  // Calculate stats
  const totalRecords = Object.values(results.records).reduce((sum, val) => {
    if (Array.isArray(val)) return sum + val.length;
    if (val !== null) return sum + 1;
    return sum;
  }, 0);

  return {
    ...results,
    lookupTime,
    totalRecords,
    hasIPv6: results.records.AAAA.length > 0,
    hasMail: results.records.MX.length > 0,
    hasSPF: results.records.TXT.some(txt => txt.toLowerCase().includes('v=spf1')),
    hasDMARC: results.records.TXT.some(txt => txt.toLowerCase().includes('v=dmarc1')),
    hasDKIM: results.records.TXT.some(txt => txt.toLowerCase().includes('v=dkim1') || txt.includes('k=rsa'))
  };
}

async function checkSubdomains(domain, subdomains = ['www', 'mail', 'ftp', 'api', 'dev', 'staging', 'admin', 'blog']) {
  const results = [];
  
  for (const sub of subdomains) {
    const fullDomain = `${sub}.${domain}`;
    try {
      const addresses = await dns.resolve4(fullDomain);
      results.push({
        subdomain: fullDomain,
        exists: true,
        ips: addresses
      });
    } catch (err) {
      results.push({
        subdomain: fullDomain,
        exists: false,
        error: err.code
      });
    }
  }
  
  return results;
}

module.exports = { lookupRecords, checkSubdomains };
