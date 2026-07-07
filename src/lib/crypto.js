const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKey(password) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password.padEnd(32, '0').slice(0, 32)),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('dreamos_salt_2026'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data, password) {
  const key = await getKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  );
  return {
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
    data: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
  };
}

export async function decrypt(encryptedObj, password) {
  const key = await getKey(password);
  const iv = new Uint8Array(encryptedObj.iv.match(/.{2}/g).map(b => parseInt(b, 16)));
  const data = new Uint8Array(encryptedObj.data.match(/.{2}/g).map(b => parseInt(b, 16)));
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return JSON.parse(decoder.decode(decrypted));
}
