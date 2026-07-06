import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ratelimitApi } from '../../services/api';
import toast from 'react-hot-toast';

interface SimResult {
  total: number;
  allowed: number;
  blocked: number;
  responses: Array<{
    request: number;
    allowed: boolean;
    remaining: number;
    timestamp: string;
  }>;
}

export default function RateLimiter() {
  const [configs, setConfigs] = useState<any>(null);
  const [endpoint, setEndpoint] = useState('/api/test');
  const [numRequests, setNumRequests] = useState(50);
  const [results, setResults] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ratelimitApi.getConfigs()
      .then(res => setConfigs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const res = await ratelimitApi.simulate(endpoint, numRequests, 10);
      setResults(res.data);
      toast.success(`Simulation complete: ${res.data.allowed} allowed, ${res.data.blocked} blocked`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await ratelimitApi.clear();
      toast.success('Rate limit store cleared');
      setResults(null);
    } catch (error: any) {
      toast.error('Failed to clear store');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">⏱️ Rate Limiter</h1>
              <p className="text-slate-400">Test rate limiting and simulate DDoS attacks</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🎯 Simulation Config</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Target Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Number of Requests</label>
                <input
                  type="number"
                  value={numRequests}
                  onChange={(e) => setNumRequests(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSimulate}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ Simulating...' : '🚀 Run Simulation'}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">⚙️ Rate Limit Configs</h2>
            {configs ? (
              <div className="space-y-3">
                {Object.entries(configs).map(([name, config]: [string, any]) => (
                  <div key={name} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-400 font-bold capitalize">{name}</span>
                      <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">{config.maxRequests} req</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Window: {Math.round(config.windowMs / 1000)}s • {config.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">Loading configs...</div>
            )}
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Simulation Results</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-sm mb-1">Total Requests</div>
                  <div className="text-3xl font-bold text-white">{results.total}</div>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
                  <div className="text-green-400 text-sm mb-1">Allowed</div>
                  <div className="text-3xl font-bold text-green-400">{results.allowed}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
                  <div className="text-red-400 text-sm mb-1">Blocked</div>
                  <div className="text-3xl font-bold text-red-400">{results.blocked}</div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Success Rate</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
                      style={{ width: `${(results.allowed / results.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-bold">{Math.round((results.allowed / results.total) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">📋 Request Log</h2>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {results.responses.map((resp, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      resp.allowed
                        ? 'bg-green-900/10 border-green-700/50'
                        : 'bg-red-900/10 border-red-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-sm">#{resp.request}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        resp.allowed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {resp.allowed ? '✅ ALLOWED' : '🚫 BLOCKED'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Remaining: {resp.remaining}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!results && !loading && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-xl text-slate-300 mb-2">Ready to Test</h3>
            <p className="text-slate-500">Configure simulation parameters and click "Run Simulation" to test rate limiting</p>
          </div>
        )}
      </div>
    </div>
  );
}
