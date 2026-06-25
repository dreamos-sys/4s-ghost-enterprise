import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { botdetectorApi } from '../../services/api';
import toast from 'react-hot-toast';

interface AnalysisResult {
  userAgent: string;
  ip: string;
  timestamp: string;
  analysis: {
    userAgent: {
      isBot: boolean;
      category: string;
      confidence: number;
      details: string[];
    };
    headers: Array<{ header: string; value: string; reason: string }>;
    behavior: Array<{ type: string; severity: string; message: string }>;
  };
  botScore: number;
  verdict: string;
  recommendation: string;
}

export default function BotDetector() {
  const [userAgent, setUserAgent] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [testAgents, setTestAgents] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    botdetectorApi.getTestAgents()
      .then(res => setTestAgents(res.data))
      .catch(err => console.error(err));
    
    // Set current browser UA
    setUserAgent(navigator.userAgent);
  }, []);

  const handleAnalyze = async () => {
    if (!userAgent.trim()) {
      toast.error('Please enter a User-Agent');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await botdetectorApi.analyzeUA(userAgent);
      setResult({
        userAgent,
        ip: 'N/A',
        timestamp: new Date().toISOString(),
        analysis: {
          userAgent: res.data,
          headers: [],
          behavior: []
        },
        botScore: res.data.confidence,
        verdict: res.data.isBot ? 'likely_bot' : 'human',
        recommendation: res.data.isBot ? 'Monitor or block' : 'Allow'
      });
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCurrent = async () => {
    setLoading(true);
    try {
      const res = await botdetectorApi.analyze({
        requestInterval: 1000,
        mouseMovements: 50,
        pageLoadTime: 2000
      });
      setResult(res.data);
      toast.success('Current request analyzed!');
    } catch (error: any) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-blue-400';
    return 'text-green-400';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'definitely_bot': return 'bg-red-900/30 text-red-400 border-red-600';
      case 'likely_bot': return 'bg-orange-900/30 text-orange-400 border-orange-600';
      case 'suspicious': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'possibly_bot': return 'bg-blue-900/30 text-blue-400 border-blue-600';
      case 'human': return 'bg-green-900/30 text-green-400 border-green-600';
      default: return 'bg-slate-900/30 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🤖 Bot Detector</h1>
              <p className="text-slate-400">Analyze User-Agents and detect automated traffic</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🔍 Analyze User-Agent</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">User-Agent String</label>
                <textarea
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  placeholder="Paste User-Agent here..."
                  className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
                </button>
                <button
                  onClick={handleAnalyzeCurrent}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
                >
                  🌐 Current
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🧪 Test User-Agents</h2>
            {testAgents ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-green-400 mb-2">Human Browsers</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {testAgents.human.map((ua: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setUserAgent(ua)}
                        className="w-full text-left p-2 bg-slate-900/50 border border-slate-700 rounded text-xs font-mono text-slate-300 hover:bg-slate-800/50 transition-all truncate"
                      >
                        {ua}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-400 mb-2">Bots & Scrapers</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {testAgents.bots.map((ua: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setUserAgent(ua)}
                        className="w-full text-left p-2 bg-slate-900/50 border border-slate-700 rounded text-xs font-mono text-slate-300 hover:bg-slate-800/50 transition-all truncate"
                      >
                        {ua}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">Loading test agents...</div>
            )}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Bot Score</div>
                  <div className={`text-4xl font-bold ${getScoreColor(result.botScore)}`}>
                    {result.botScore}%
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Verdict</div>
                  <div className={`px-3 py-1 rounded border inline-block ${getVerdictColor(result.verdict)}`}>
                    {result.verdict.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Recommendation</div>
                  <div className="text-white font-medium">{result.recommendation}</div>
                </div>
              </div>

              {result.analysis.userAgent.details.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-slate-300 mb-2">Detection Details</h3>
                  <div className="space-y-2">
                    {result.analysis.userAgent.details.map((detail, idx) => (
                      <div key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-2">Category</h3>
                <div className="px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded inline-block capitalize">
                  {result.analysis.userAgent.category.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl text-slate-300 mb-2">Ready to Analyze</h3>
            <p className="text-slate-500">Enter a User-Agent string or click "Current" to analyze your browser</p>
          </div>
        )}
      </div>
    </div>
  );
}
