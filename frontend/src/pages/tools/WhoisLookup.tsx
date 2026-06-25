import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { whoisApi } from '../../services/api';
import toast from 'react-hot-toast';

interface WhoisResult {
  domain: string;
  registrar: string;
  creationDate: string;
  expirationDate: string;
  updatedDate: string;
  nameServers: string[];
  status: string[];
  registrant: {
    name: string;
    organization: string;
    country: string;
    email: string;
  };
  admin: {
    name: string;
    organization: string;
    country: string;
  };
  dnssec: string;
  lookupTime: number;
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLookup = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await whoisApi.lookup(domain);
      setResult(res.data);
      toast.success(`WHOIS data retrieved for ${res.data.domain}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'WHOIS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Unknown') return 'Unknown';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getDaysUntilExpiration = (dateStr: string) => {
    if (!dateStr || dateStr === 'Unknown') return null;
    try {
      const expDate = new Date(dateStr);
      const now = new Date();
      const diff = expDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔎 WHOIS Lookup</h1>
              <p className="text-slate-400">Query domain registration information</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-2">Domain Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                placeholder="example.com"
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
              <button
                onClick={handleLookup}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Searching...' : '🔎 Lookup'}
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Quick test:</span>
            {['google.com', 'github.com', 'cloudflare.com', 'example.org'].map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className="px-3 py-1 bg-slate-700/50 text-slate-300 border border-slate-600 rounded text-xs hover:bg-slate-600/50 transition-all"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Domain Overview */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">🌐 Domain Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Domain</div>
                  <div className="text-white text-xl font-bold font-mono">{result.domain}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Registrar</div>
                  <div className="text-white text-lg">{result.registrar}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Created</div>
                  <div className="text-green-400 text-lg">{formatDate(result.creationDate)}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Expires</div>
                  <div className="text-orange-400 text-lg">{formatDate(result.expirationDate)}</div>
                  {getDaysUntilExpiration(result.expirationDate) !== null && (
                    <div className={`text-xs mt-1 ${
                      getDaysUntilExpiration(result.expirationDate)! < 30 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {getDaysUntilExpiration(result.expirationDate)! > 0
                        ? `${getDaysUntilExpiration(result.expirationDate)} days remaining`
                        : 'EXPIRED'}
                    </div>
                  )}
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Last Updated</div>
                  <div className="text-white text-lg">{formatDate(result.updatedDate)}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">DNSSEC</div>
                  <div className={`text-lg ${result.dnssec === 'Unsigned' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {result.dnssec}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                ⏱️ Lookup completed in {result.lookupTime}ms
              </div>
            </div>

            {/* Registrant Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">👤 Registrant Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Name</div>
                  <div className="text-white">{result.registrant.name}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Organization</div>
                  <div className="text-white">{result.registrant.organization}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Country</div>
                  <div className="text-cyan-400">{result.registrant.country}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Email</div>
                  <div className="text-white font-mono text-sm">{result.registrant.email}</div>
                </div>
              </div>
            </div>

            {/* Name Servers */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">🌍 Name Servers</h2>
              {result.nameServers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.nameServers.map((ns, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-cyan-300">
                      {ns}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500">No name servers found</div>
              )}
            </div>

            {/* Domain Status */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">🔒 Domain Status</h2>
              {result.status.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.status.map((status, idx) => (
                    <div key={idx} className="px-3 py-2 bg-purple-900/20 border border-purple-700 rounded-lg text-purple-300 text-sm">
                      {status}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500">No status information</div>
              )}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔎</div>
            <h3 className="text-xl text-slate-300 mb-2">Ready to Lookup</h3>
            <p className="text-slate-500">Enter a domain name to retrieve WHOIS registration information</p>
          </div>
        )}
      </div>
    </div>
  );
}
