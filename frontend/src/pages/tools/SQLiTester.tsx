import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sqliApi } from '../../services/api';
import toast from 'react-hot-toast';

interface TestResult {
  payload: string;
  vulnerable: boolean;
  hasError: boolean;
  isTimeBased: boolean;
  responseTime: number;
  statusCode: number;
  responseLength: number;
  error?: string;
}

interface ParamResult {
  parameter: string;
  originalValue: string;
  tests: TestResult[];
  vulnerable: boolean;
  successfulPayloads: Array<{ payload: string; type: string }>;
}

interface ScanResults {
  url: string;
  method: string;
  attackType: string;
  totalParams: number;
  vulnerableParams: number;
  totalTests: number;
  scanTime: number;
  results: ParamResult[];
}

export default function SQLiTester() {
  const [url, setUrl] = useState('https://example.com/page?id=1&category=test');
  const [attackType, setAttackType] = useState('error-based');
  const [method, setMethod] = useState('GET');
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [attackTypes, setAttackTypes] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    sqliApi.getPayloads()
      .then(res => setAttackTypes(res.data.attackTypes))
      .catch(err => console.error('Failed to load attack types:', err));
  }, []);

  const handleTest = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    setIsTesting(true);
    setResults(null);

    try {
      const response = await sqliApi.test(url, attackType, method);
      setResults(response.data);
      
      if (response.data.vulnerableParams === 0) {
        toast.success('No SQL injection vulnerabilities found!');
      } else {
        toast.error(`Found ${response.data.vulnerableParams} vulnerable parameter(s)!`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const loadExample = () => {
    setUrl('https://example.com/products.php?id=1&category=electronics&sort=price');
    toast.success('Example URL loaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🗄️ SQL Injection Tester</h1>
              <p className="text-slate-400">Test URL parameters for SQL injection vulnerabilities</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Target URL (with parameters)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page?id=1&category=test"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Attack Type</label>
              <select
                value={attackType}
                onChange={(e) => setAttackType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {attackTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">HTTP Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {isTesting ? '⏳ Testing...' : '💉 Test for SQLi'}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              📋 Load Example
            </button>
            <button
              onClick={() => { setUrl(''); setResults(null); }}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">📊 Test Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">URL</div>
                  <div className="text-white text-sm font-mono truncate">{results.url}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Total Params</div>
                  <div className="text-white text-2xl font-bold">{results.totalParams}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
                  <div className="text-red-400 text-xs mb-1">Vulnerable</div>
                  <div className="text-red-400 text-2xl font-bold">{results.vulnerableParams}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Total Tests</div>
                  <div className="text-white text-2xl font-bold">{results.totalTests}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Scan Time</div>
                  <div className="text-cyan-400 text-2xl font-bold">{results.scanTime}ms</div>
                </div>
              </div>
            </div>

            {results.results.map((paramResult, idx) => (
              <div key={idx} className={`bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 ${
                paramResult.vulnerable ? 'border-red-700' : 'border-green-700'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Parameter: <span className="text-cyan-400">{paramResult.parameter}</span>
                    </h3>
                    <p className="text-slate-400 text-sm">Original value: {paramResult.originalValue}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${
                    paramResult.vulnerable
                      ? 'bg-red-900/30 text-red-400 border border-red-600'
                      : 'bg-green-900/30 text-green-400 border border-green-600'
                  }`}>
                    {paramResult.vulnerable ? '⚠️ VULNERABLE' : '✅ SAFE'}
                  </div>
                </div>

                {paramResult.vulnerable && paramResult.successfulPayloads.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-red-400 mb-2">Successful Payloads:</h4>
                    <div className="space-y-2">
                      {paramResult.successfulPayloads.map((sp, spIdx) => (
                        <div key={spIdx} className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                          <div className="text-xs text-red-400 mb-1">Type: {sp.type}</div>
                          <code className="text-white font-mono text-sm break-all">{sp.payload}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <details className="mt-4">
                  <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 text-sm">
                    View all test results ({paramResult.tests.length} tests)
                  </summary>
                  <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                    {paramResult.tests.map((test, testIdx) => (
                      <div key={testIdx} className={`p-3 rounded-lg border ${
                        test.vulnerable
                          ? 'bg-red-900/20 border-red-700'
                          : 'bg-slate-900/50 border-slate-700'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <code className="text-xs font-mono break-all flex-1">{test.payload}</code>
                          <div className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                            test.vulnerable ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {test.vulnerable ? 'VULN' : 'SAFE'}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span>Status: {test.statusCode}</span>
                          <span>Time: {test.responseTime}ms</span>
                          <span>Length: {test.responseLength}</span>
                          {test.hasError && <span className="text-red-400">SQL Error</span>}
                          {test.isTimeBased && <span className="text-yellow-400">Time-based</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}

        {!results && !isTesting && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🗄️</div>
            <h3 className="text-xl text-slate-300 mb-2">No Test Results Yet</h3>
            <p className="text-slate-500">Enter a URL with parameters, then click "Test for SQLi" to detect vulnerabilities</p>
          </div>
        )}
      </div>
    </div>
  );
}
