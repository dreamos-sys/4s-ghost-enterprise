import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scannerApi } from '../../services/api';
import toast from 'react-hot-toast';

interface PortResult {
  port: number;
  status: 'open' | 'closed';
  responseTime: number;
  error?: string;
}

interface ScanResults {
  host: string;
  totalPorts: number;
  openPorts: number;
  closedPorts: number;
  scanTime: number;
  results: PortResult[];
}

export default function PortScanner() {
  const [host, setHost] = useState('localhost');
  const [ports, setPorts] = useState('80,443,3000,3001');
  const [timeout, setTimeout] = useState(1000);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [presets, setPresets] = useState<Record<string, number[]>>({});
  const navigate = useNavigate();

  useEffect(() => {
    scannerApi.getPresets()
      .then(res => setPresets(res.data.presets))
      .catch(err => console.error('Failed to load presets:', err));
  }, []);

  const handleScan = async () => {
    if (!host.trim()) {
      toast.error('Please enter a host');
      return;
    }
    if (!ports.trim()) {
      toast.error('Please enter ports to scan');
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const response = await scannerApi.scanPorts(host, ports, timeout);
      setResults(response.data);
      toast.success(`Scan complete! Found ${response.data.openPorts} open ports`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const loadPreset = (presetName: string) => {
    if (presets[presetName]) {
      setPorts(presets[presetName].join(','));
      toast.success(`Loaded ${presetName} preset`);
    }
  };

  const copyResults = () => {
    if (!results) return;
    const text = results.results
      .map(r => `${r.port}: ${r.status} (${r.responseTime}ms)`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Results copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔍 Port Scanner</h1>
              <p className="text-slate-400">Scan open ports on target host</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Target Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost or 192.168.1.1"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Ports (comma-separated or range)</label>
              <input
                type="text"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
                placeholder="80,443 or 80-90"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Timeout (ms)</label>
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(Number(e.target.value))}
              min="100"
              max="10000"
              step="100"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(presets).map(preset => (
                <button
                  key={preset}
                  onClick={() => loadPreset(preset)}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all text-sm capitalize"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? '⏳ Scanning...' : '🔍 Scan Ports'}
            </button>
            <button
              onClick={() => { setHost('localhost'); setPorts('80,443,3000,3001'); setResults(null); }}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">📊 Scan Summary</h2>
                <button
                  onClick={copyResults}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
                >
                  📋 Copy Results
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Host</div>
                  <div className="text-white text-lg font-mono">{results.host}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Total Ports</div>
                  <div className="text-white text-lg font-mono">{results.totalPorts}</div>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
                  <div className="text-green-400 text-xs mb-1">Open Ports</div>
                  <div className="text-green-400 text-2xl font-bold">{results.openPorts}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
                  <div className="text-red-400 text-xs mb-1">Closed Ports</div>
                  <div className="text-red-400 text-2xl font-bold">{results.closedPorts}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-400">⏱️ Scan completed in {results.scanTime}ms</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">📋 Detailed Results</h2>
              <div className="space-y-2">
                {results.results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-4 rounded-lg border ${
                      result.status === 'open'
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-red-900/20 border-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${
                        result.status === 'open' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.port}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${
                          result.status === 'open' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.status === 'open' ? '✅ OPEN' : '❌ CLOSED'}
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">{result.responseTime}ms</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!results && !isScanning && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-slate-300 mb-2">No Scan Results Yet</h3>
            <p className="text-slate-500">Enter a target host and ports, then click "Scan Ports" to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
