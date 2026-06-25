import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dnsApi } from '../../services/api';
import toast from 'react-hot-toast';

interface DNSResult {
  domain: string;
  timestamp: string;
  records: {
    A: string[];
    AAAA: string[];
    MX: Array<{ priority: number; exchange: string }>;
    TXT: string[];
    NS: string[];
    CNAME: string[];
    SOA: any;
  };
  errors: Array<{ type: string; message: string }>;
  lookupTime: number;
  totalRecords: number;
  hasIPv6: boolean;
  hasMail: boolean;
  hasSPF: boolean;
  hasDMARC: boolean;
  hasDKIM: boolean;
}

export default function DNSRecon() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<DNSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleLookup = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await dnsApi.lookup(domain);
      setResult(res.data);
      toast.success(`Found ${res.data.totalRecords} DNS records`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'DNS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const getRecordIcon = (type: string) => {
    const icons: Record<string, string> = {
      A: '🌐', AAAA: '🌍', MX: '📧', TXT: '📝',
      NS: '🏛️', CNAME: '🔗', SOA: '📋'
    };
    return icons[type] || '📄';
  };

  const tabs = ['all', 'A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🌐 DNS Recon</h1>
              <p className="text-slate-400">Comprehensive DNS record enumeration</p>
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
                {loading ? '⏳ Scanning...' : '🔎 Scan DNS'}
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Quick test:</span>
            {['google.com', 'github.com', 'cloudflare.com', 'microsoft.com'].map(d => (
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
            {/* Stats Overview */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 DNS Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{result.totalRecords}</div>
                  <div className="text-xs text-slate-400 mt-1">Total Records</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${result.hasIPv6 ? 'text-green-400' : 'text-slate-500'}`}>
                    {result.hasIPv6 ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">IPv6 Support</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${result.hasMail ? 'text-green-400' : 'text-slate-500'}`}>
                    {result.hasMail ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Mail Server</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-xs text-slate-400 mt-3">⏱️ {result.lookupTime}ms</div>
                  <div className="text-xs text-slate-400">Lookup Time</div>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-3 rounded-lg border text-center ${result.hasSPF ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                  <div className={`text-sm font-bold ${result.hasSPF ? 'text-green-400' : 'text-red-400'}`}>
                    {result.hasSPF ? '✓' : '✗'} SPF
                  </div>
                </div>
                <div className={`p-3 rounded-lg border text-center ${result.hasDMARC ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                  <div className={`text-sm font-bold ${result.hasDMARC ? 'text-green-400' : 'text-red-400'}`}>
                    {result.hasDMARC ? '✓' : '✗'} DMARC
                  </div>
                </div>
                <div className={`p-3 rounded-lg border text-center ${result.hasDKIM ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                  <div className={`text-sm font-bold ${result.hasDKIM ? 'text-green-400' : 'text-red-400'}`}>
                    {result.hasDKIM ? '✓' : '✗'} DKIM
                  </div>
                </div>
              </div>
            </div>

            {/* Record Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {tab === 'all' ? '📊 All' : `${getRecordIcon(tab)} ${tab}`}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {activeTab === 'all' ? (
                  Object.entries(result.records).map(([type, records]) => {
                    if (!records || (Array.isArray(records) && records.length === 0)) return null;
                    return (
                      <div key={type} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getRecordIcon(type)}</span>
                          <h3 className="text-lg font-bold text-white">{type} Records</h3>
                          <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                            {Array.isArray(records) ? records.length : 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {Array.isArray(records) ? (
                            records.map((record, idx) => (
                              <div key={idx} className="p-2 bg-slate-900/50 rounded font-mono text-sm text-cyan-300 break-all">
                                {typeof record === 'object' ? JSON.stringify(record) : record}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 bg-slate-900/50 rounded font-mono text-sm text-cyan-300 break-all">
                              {JSON.stringify(records, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getRecordIcon(activeTab)}</span>
                      <h3 className="text-lg font-bold text-white">{activeTab} Records</h3>
                    </div>
                    {(() => {
                      const records = result.records[activeTab as keyof typeof result.records];
                      if (!records || (Array.isArray(records) && records.length === 0)) {
                        return <div className="text-slate-500">No {activeTab} records found</div>;
                      }
                      return (
                        <div className="space-y-1">
                          {Array.isArray(records) ? (
                            records.map((record, idx) => (
                              <div key={idx} className="p-2 bg-slate-900/50 rounded font-mono text-sm text-cyan-300 break-all">
                                {typeof record === 'object' ? JSON.stringify(record) : record}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 bg-slate-900/50 rounded font-mono text-sm text-cyan-300 break-all">
                              {JSON.stringify(records, null, 2)}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-red-400 mb-4">⚠️ Lookup Errors</h2>
                <div className="space-y-2">
                  {result.errors.map((err, idx) => (
                    <div key={idx} className="p-3 bg-red-900/30 rounded border border-red-700">
                      <span className="font-bold text-red-400">{err.type}:</span>
                      <span className="text-slate-300 ml-2">{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h3 className="text-xl text-slate-300 mb-2">Ready to Scan</h3>
            <p className="text-slate-500">Enter a domain to enumerate all DNS records (A, AAAA, MX, TXT, NS, CNAME, SOA)</p>
          </div>
        )}
      </div>
    </div>
  );
}
