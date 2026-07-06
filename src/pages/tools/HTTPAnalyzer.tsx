import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpApi } from '../../services/api';
import toast from 'react-hot-toast';

interface HeaderAnalysis {
  hsts: any;
  csp: any;
  xFrame: any;
  xContentType: any;
  xXSS: any;
  referrer: any;
  permissions: any;
  cors: any;
  server: string | null;
  poweredBy: string | null;
}

interface HTTPResult {
  url: string;
  statusCode: number;
  lookupTime: number;
  headers: Array<{ name: string; value: string }>;
  analysis: HeaderAnalysis;
  score: number;
  grade: string;
  missing: string[];
  warnings: string[];
  totalHeaders: number;
}

export default function HTTPAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<HTTPResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await httpApi.analyze(url);
      setResult(res.data);
      toast.success(`Analysis complete - Grade: ${res.data.grade}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const SecurityHeader = ({ name, data, description }: any) => (
    <div className={`p-4 rounded-lg border ${data.present && data.secure ? 'bg-green-900/20 border-green-700' : data.present ? 'bg-yellow-900/20 border-yellow-700' : 'bg-red-900/20 border-red-700'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-xs text-slate-400 mt-1">{description}</div>
        </div>
        <div className={`text-2xl ${data.present && data.secure ? 'text-green-400' : data.present ? 'text-yellow-400' : 'text-red-400'}`}>
          {data.present && data.secure ? '✓' : data.present ? '!' : '✗'}
        </div>
      </div>
      {data.present && data.value && (
        <div className="mt-2 p-2 bg-slate-900/50 rounded font-mono text-xs text-cyan-300 break-all">
          {typeof data.value === 'string' && data.value.length > 150 ? data.value.substring(0, 150) + '...' : data.value}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">📡 HTTP Header Analyzer</h1>
              <p className="text-slate-400">Analyze security headers and configuration</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Analyzing...' : '📡 Analyze'}
            </button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {['https://google.com', 'https://github.com', 'https://cloudflare.com', 'https://mozilla.org'].map(u => (
              <button key={u} onClick={() => setUrl(u)} className="px-3 py-1 bg-slate-700/50 text-slate-300 border border-slate-600 rounded text-xs hover:bg-slate-600/50">
                {u}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getGradeColor(result.grade)}`}>{result.grade}</div>
                  <div className="text-slate-400 mt-2">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-400">{result.score}</div>
                  <div className="text-slate-400 mt-2">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{result.totalHeaders}</div>
                  <div className="text-slate-400 mt-2">Headers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{result.missing.length}</div>
                  <div className="text-slate-400 mt-2">Missing</div>
                </div>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">⚠️ Warnings</h3>
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="text-sm text-yellow-200 flex items-start gap-2">
                      <span>•</span> <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {['security', 'headers', 'details'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${activeTab === tab ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">🛡️ Security Headers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecurityHeader name="HSTS" data={result.analysis.hsts} description="Forces HTTPS connections" />
                    <SecurityHeader name="Content-Security-Policy" data={result.analysis.csp} description="Prevents XSS and injection" />
                    <SecurityHeader name="X-Frame-Options" data={result.analysis.xFrame} description="Prevents clickjacking" />
                    <SecurityHeader name="X-Content-Type-Options" data={result.analysis.xContentType} description="Prevents MIME sniffing" />
                    <SecurityHeader name="X-XSS-Protection" data={result.analysis.xXSS} description="Legacy XSS filter" />
                    <SecurityHeader name="Referrer-Policy" data={result.analysis.referrer} description="Controls referrer info" />
                  </div>
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-cyan-400 mb-4">📋 All Headers ({result.totalHeaders})</h2>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {result.headers.map((h, i) => (
                      <div key={i} className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                        <div className="text-cyan-400 font-bold text-sm mb-1">{h.name}:</div>
                        <div className="text-slate-300 font-mono text-xs break-all">{h.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400">🔍 Server Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Status Code</div>
                      <div className="text-white text-lg font-mono">{result.statusCode}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-1">Response Time</div>
                      <div className="text-white text-lg">{result.lookupTime}ms</div>
                    </div>
                    {result.analysis.server && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                        <div className="text-yellow-400 text-xs mb-1">⚠️ Server Header Exposed</div>
                        <div className="text-white font-mono">{result.analysis.server}</div>
                      </div>
                    )}
                    {result.analysis.poweredBy && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                        <div className="text-yellow-400 text-xs mb-1">⚠️ X-Powered-By Exposed</div>
                        <div className="text-white font-mono">{result.analysis.poweredBy}</div>
                      </div>
                    )}
                    {result.analysis.cors.present && (
                      <div className={`border rounded-lg p-4 ${result.analysis.cors.wildcard ? 'bg-yellow-900/20 border-yellow-700' : 'bg-green-900/20 border-green-700'}`}>
                        <div className="text-xs mb-1">CORS Origin</div>
                        <div className="text-white font-mono">{result.analysis.cors.origin}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
