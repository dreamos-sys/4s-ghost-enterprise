import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sslApi } from '../../services/api';
import toast from 'react-hot-toast';

interface SSLResult {
  domain: string;
  port: number;
  lookupTime: number;
  certificate: {
    subject: {
      commonName: string;
      organization: string;
      organizationalUnit: string;
      locality: string;
      state: string;
      country: string;
    };
    issuer: {
      commonName: string;
      organization: string;
      country: string;
    };
    validity: {
      notBefore: string;
      notAfter: string;
      daysSinceIssued: number;
      daysUntilExpiry: number;
      totalValidDays: number;
    };
    technical: {
      serialNumber: string;
      fingerprint: string;
      fingerprint256: string;
      publicKey: {
        algorithm: string;
        size: string;
      };
    };
    san: string[];
    chain: Array<{
      subject: string;
      issuer: string;
      validFrom: string;
      validTo: string;
      fingerprint: string;
      serialNumber: string;
    }>;
  };
  security: {
    isValid: boolean;
    isExpired: boolean;
    isNotYetValid: boolean;
    daysUntilExpiry: number;
    isExpiringSoon: boolean;
    isExpiringCritical: boolean;
    protocol: string;
    cipher: { name: string; version: string } | null;
    hasStrongCipher: boolean;
    supportsHSTS: boolean;
    hstsMaxAge: number | null;
  };
  score: number;
  grade: string;
  recommendations: Array<{
    severity: string;
    issue: string;
    action: string;
  }>;
}

export default function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [port, setPort] = useState(443);
  const [result, setResult] = useState<SSLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await sslApi.check(domain, port);
      setResult(res.data);
      toast.success(`SSL certificate analyzed - Grade: ${res.data.grade}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'SSL check failed');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400 bg-green-900/30 border-green-600';
      case 'B': return 'text-blue-400 bg-blue-900/30 border-blue-600';
      case 'C': return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
      case 'D': return 'text-orange-400 bg-orange-900/30 border-orange-600';
      case 'F': return 'text-red-400 bg-red-900/30 border-red-600';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-900/20';
      case 'warning': return 'border-yellow-600 bg-yellow-900/20';
      case 'info': return 'border-blue-600 bg-blue-900/20';
      case 'success': return 'border-green-600 bg-green-900/20';
      default: return 'border-slate-600 bg-slate-900/20';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = ['overview', 'certificate', 'security', 'chain', 'recommendations'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔒 SSL Certificate Checker</h1>
              <p className="text-slate-400">Analyze SSL/TLS certificates and security configuration</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-slate-300 text-sm font-medium mb-2">Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                placeholder="example.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCheck}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Checking...' : '🔒 Check SSL'}
            </button>
            {['google.com', 'github.com', 'cloudflare.com', 'mozilla.org'].map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className="px-4 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all text-sm"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Grade & Score */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getGradeColor(result.grade).split(' ')[0]}`}>
                    {result.grade}
                  </div>
                  <div className="text-slate-400 mt-2">Security Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-400">{result.score}</div>
                  <div className="text-slate-400 mt-2">Security Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${result.security.isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {result.security.isValid ? '✓ Valid' : '✗ Invalid'}
                  </div>
                  <div className="text-slate-400 mt-2">
                    {result.security.daysUntilExpiry} days until expiry
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">📊 Certificate Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Domain</div>
                      <div className="text-white text-lg font-mono">{result.domain}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Issuer</div>
                      <div className="text-white text-lg">{result.certificate.issuer.organization}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Valid From</div>
                      <div className="text-green-400">{formatDate(result.certificate.validity.notBefore)}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Valid Until</div>
                      <div className="text-orange-400">{formatDate(result.certificate.validity.notAfter)}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Protocol</div>
                      <div className="text-white">{result.security.protocol}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Cipher</div>
                      <div className="text-white text-sm font-mono">{result.security.cipher?.name || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'certificate' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">📜 Certificate Details</h2>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Subject</h3>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                      <div><span className="text-slate-400">Common Name:</span> <span className="text-white">{result.certificate.subject.commonName}</span></div>
                      <div><span className="text-slate-400">Organization:</span> <span className="text-white">{result.certificate.subject.organization}</span></div>
                      <div><span className="text-slate-400">Country:</span> <span className="text-white">{result.certificate.subject.country}</span></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Issuer</h3>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                      <div><span className="text-slate-400">Common Name:</span> <span className="text-white">{result.certificate.issuer.commonName}</span></div>
                      <div><span className="text-slate-400">Organization:</span> <span className="text-white">{result.certificate.issuer.organization}</span></div>
                      <div><span className="text-slate-400">Country:</span> <span className="text-white">{result.certificate.issuer.country}</span></div>
                    </div>
                  </div>

                  {result.certificate.san.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-300 mb-2">Subject Alternative Names (SAN)</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.certificate.san.map((name, idx) => (
                          <div key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded text-sm font-mono">
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Technical Details</h3>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2 font-mono text-sm">
                      <div><span className="text-slate-400">Serial:</span> <span className="text-white break-all">{result.certificate.technical.serialNumber}</span></div>
                      <div><span className="text-slate-400">Fingerprint (SHA-256):</span> <span className="text-white break-all">{result.certificate.technical.fingerprint256}</span></div>
                      <div><span className="text-slate-400">Public Key:</span> <span className="text-white">{result.certificate.technical.publicKey.algorithm} ({result.certificate.technical.publicKey.size} bits)</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">🛡️ Security Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${result.security.isValid ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Certificate Validity</span>
                        <span className={`text-lg font-bold ${result.security.isValid ? 'text-green-400' : 'text-red-400'}`}>
                          {result.security.isValid ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${!result.security.isExpired ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Not Expired</span>
                        <span className={`text-lg font-bold ${!result.security.isExpired ? 'text-green-400' : 'text-red-400'}`}>
                          {!result.security.isExpired ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${result.security.hasStrongCipher ? 'bg-green-900/20 border-green-700' : 'bg-yellow-900/20 border-yellow-700'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Strong Cipher</span>
                        <span className={`text-lg font-bold ${result.security.hasStrongCipher ? 'text-green-400' : 'text-yellow-400'}`}>
                          {result.security.hasStrongCipher ? '✓' : '!'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${result.security.supportsHSTS ? 'bg-green-900/20 border-green-700' : 'bg-yellow-900/20 border-yellow-700'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">HSTS Enabled</span>
                        <span className={`text-lg font-bold ${result.security.supportsHSTS ? 'text-green-400' : 'text-yellow-400'}`}>
                          {result.security.supportsHSTS ? '✓' : '!'}
                        </span>
                      </div>
                      {result.security.hstsMaxAge && (
                        <div className="text-xs text-slate-400 mt-1">Max-Age: {result.security.hstsMaxAge}s</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chain' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">🔗 Certificate Chain</h2>
                  <div className="space-y-3">
                    {result.certificate.chain.map((cert, idx) => (
                      <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{idx === 0 ? '🏠' : idx === result.certificate.chain.length - 1 ? '🏛️' : '🔗'}</span>
                          <span className="text-white font-bold">{cert.subject}</span>
                          <span className="text-xs px-2 py-1 bg-slate-700 rounded">
                            {idx === 0 ? 'End Entity' : idx === result.certificate.chain.length - 1 ? 'Root CA' : 'Intermediate'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 space-y-1 ml-8">
                          <div>Issuer: {cert.issuer}</div>
                          <div>Valid: {formatDate(cert.validFrom)} → {formatDate(cert.validTo)}</div>
                          <div className="font-mono text-xs break-all">Fingerprint: {cert.fingerprint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">💡 Recommendations</h2>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(rec.severity)}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {rec.severity === 'critical' ? '🚨' : rec.severity === 'warning' ? '⚠️' : rec.severity === 'info' ? 'ℹ️' : '✅'}
                          </span>
                          <div className="flex-1">
                            <div className="font-bold text-white mb-1">{rec.issue}</div>
                            <div className="text-sm text-slate-300">{rec.action}</div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-slate-700 rounded capitalize">{rec.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl text-slate-300 mb-2">Ready to Check</h3>
            <p className="text-slate-500">Enter a domain to analyze SSL/TLS certificate and security configuration</p>
          </div>
        )}
      </div>
    </div>
  );
}
