const crypto = require('crypto');

function generateHash(input, algorithm = 'sha256', encoding = 'utf8') {
  const algorithms = ['md5', 'sha1', 'sha256', 'sha512', 'sha3-256', 'sha3-512'];
  
  if (!algorithms.includes(algorithm)) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
  
  const hash = crypto.createHash(algorithm);
  hash.update(input, encoding);
  
  return {
    algorithm: algorithm.toUpperCase(),
    hash: hash.digest('hex'),
    inputLength: input.length,
    timestamp: new Date().toISOString()
  };
}

function generateMultipleHashes(input, encoding = 'utf8') {
  const algorithms = ['md5', 'sha1', 'sha256', 'sha512'];
  const results = {};
  
  algorithms.forEach(algo => {
    const hash = crypto.createHash(algo);
    hash.update(input, encoding);
    results[algo] = hash.digest('hex');
  });
  
  return {
    input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
    inputLength: input.length,
    hashes: results,
    timestamp: new Date().toISOString()
  };
}

function detectHashType(hash) {
  const patterns = {
    'MD5': /^[a-f0-9]{32}$/i,
    'SHA1': /^[a-f0-9]{40}$/i,
    'SHA256': /^[a-f0-9]{64}$/i,
    'SHA512': /^[a-f0-9]{128}$/i
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(hash)) {
      return type;
    }
  }
  
  return 'Unknown';
}

function compareHashes(input, hashes) {
  const results = [];
  
  hashes.forEach(({ hash, algorithm }) => {
    const computed = crypto.createHash(algorithm.toLowerCase());
    computed.update(input);
    const computedHash = computed.digest('hex');
    
    results.push({
      algorithm: algorithm.toUpperCase(),
      expected: hash,
      computed: computedHash,
      match: computedHash.toLowerCase() === hash.toLowerCase()
    });
  });
  
  return results;
}

module.exports = { generateHash, generateMultipleHashes, detectHashType, compareHashes };
