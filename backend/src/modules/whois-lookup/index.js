const whois = require('whois-json');

async function lookupDomain(domain) {
  try {
    // Clean domain (remove http://, www, etc)
    let cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .trim();

    if (!cleanDomain) {
      throw new Error('Invalid domain format');
    }

    const startTime = Date.now();
    const result = await whois(cleanDomain);
    const lookupTime = Date.now() - startTime;

    // Parse and format results
    return {
      domain: cleanDomain,
      registrar: result.registrarName || result.registrar || 'Unknown',
      creationDate: result.creationDate || result.domainRegistered || 'Unknown',
      expirationDate: result.expirationDate || result.registrarRegistrationExpirationDate || 'Unknown',
      updatedDate: result.changed || result.updatedDate || 'Unknown',
      nameServers: parseNameServers(result.nameServers || result.nameServer),
      status: parseStatus(result.status),
      registrant: {
        name: result.registrantName || 'Hidden/Unknown',
        organization: result.registrantOrganization || 'Hidden/Unknown',
        country: result.registrantCountry || 'Hidden/Unknown',
        email: result.registrantEmail || 'Hidden/Unknown'
      },
      admin: {
        name: result.adminName || 'Hidden/Unknown',
        organization: result.adminOrganization || 'Hidden/Unknown',
        country: result.adminCountry || 'Hidden/Unknown'
      },
      dnssec: result.dnssec || 'Unsigned',
      lookupTime: lookupTime,
      raw: result
    };
  } catch (error) {
    throw new Error('WHOIS lookup failed: ' + error.message);
  }
}

function parseNameServers(ns) {
  if (!ns) return [];
  if (Array.isArray(ns)) return ns;
  if (typeof ns === 'string') return ns.split('\n').map(s => s.trim()).filter(Boolean);
  return [];
}

function parseStatus(status) {
  if (!status) return [];
  if (Array.isArray(status)) return status;
  if (typeof status === 'string') return status.split('\n').map(s => s.trim()).filter(Boolean);
  return [];
}

module.exports = { lookupDomain };
