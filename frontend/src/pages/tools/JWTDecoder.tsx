import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<JWTHeader | null>(null);
  const [payload, setPayload] = useState<JWTPayload | null>(null);
  const [signature, setSignature] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const navigate = useNavigate();

  const decodeJWT = () => {
    try {
      if (!token.trim()) {
        toast.error('Please enter a JWT token');
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        toast.error('Invalid JWT format (must have 3 parts)');
        return;
      }

      // Decode header
      const headerJson = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const decodedHeader = JSON.parse(headerJson);
      setHeader(decodedHeader);

      // Decode payload
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);
      setPayload(decodedPayload);

      // Store signature
      setSignature(parts[2]);

      // Validate expiration
      const now = Math.floor(Date.now() / 1000);
      setIsValid(decodedPayload.exp > now);

      toast.success('JWT decoded successfully!');
    } catch (error) {
      toast.error('Failed to decode JWT');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTimeRemaining = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = exp - now;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s remaining`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔐 JWT Decoder</h1>
              <p className="text-slate-400">Decode and inspect JSON Web Tokens</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            JWT Token
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZHJlYW1vcy5kZXYiLCJyb2xlIjoiZGV2IiwiaWF0IjoxNzA1MTIzNDU2LCJleHAiOjE3MDUxMjQzNTZ9.signature"
            className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-none"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={decodeJWT}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              🔍 Decode JWT
            </button>
            <button
              onClick={() => {
                setToken('');
                setHeader(null);
                setPayload(null);
                setSignature('');
                setIsValid(false);
              }}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {header && payload && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-400">📋 Header</h2>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(header, null, 2), 'Header')}
                  className="px-4 py-2 bg-pink-500/20 text-pink-400 border border-pink-500/50 rounded-lg hover:bg-pink-500/30 transition-all text-sm"
                >
                  📋 Copy
                </button>
              </div>
              <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-400">📦 Payload</h2>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), 'Payload')}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all text-sm"
                >
                  📋 Copy
                </button>
              </div>
              
              {/* Claims */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">User ID</div>
                  <div className="text-white text-lg font-mono">{payload.userId}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Email</div>
                  <div className="text-white text-lg font-mono">{payload.email}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Role</div>
                  <div className="text-cyan-400 text-lg font-mono capitalize">{payload.role}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Status</div>
                  <div className={`text-lg font-mono ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {isValid ? '✅ Valid' : '❌ Expired'}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-3 mb-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Issued At (iat)</div>
                  <div className="text-white text-sm font-mono">{formatTimestamp(payload.iat)}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Expires At (exp)</div>
                  <div className="text-white text-sm font-mono">{formatTimestamp(payload.exp)}</div>
                  <div className={`text-xs mt-1 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                    ⏱️ {getTimeRemaining(payload.exp)}
                  </div>
                </div>
              </div>

              <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>

            {/* Signature */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">🔏 Signature</h2>
                <button
                  onClick={() => copyToClipboard(signature, 'Signature')}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-xs mb-2">HMAC SHA-256 Signature</div>
                <div className="text-cyan-400 font-mono text-sm break-all">{signature}</div>
              </div>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="text-yellow-400 text-sm">
                  ⚠️ <strong>Note:</strong> Signature verification requires the secret key. This decoder only validates format and expiration.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!header && !payload && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-slate-300 mb-2">No JWT Decoded Yet</h3>
            <p className="text-slate-500">Paste a JWT token above and click "Decode" to inspect its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}
