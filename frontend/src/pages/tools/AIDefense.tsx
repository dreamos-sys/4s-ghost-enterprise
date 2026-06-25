import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../../services/api';
import toast from 'react-hot-toast';

interface ThreatLandscape {
  globalThreatScore: number;
  globalRiskLevel: string;
  stats: {
    totalAttacks: number;
    uniqueAttackers: number;
    attackVectors: number;
  };
  attackDistribution: Array<{ type: string; count: number; percentage: number }>;
  topThreats: Array<{
    ip: string;
    threatScore: number;
    riskLevel: string;
    totalAttacks: number;
    uniqueAttackTypes: number;
    attackBreakdown: Array<{ type: string; count: number }>;
    recommendation: {
      action: string;
      reason: string;
      steps: string[];
    };
  }>;
  recentActivity: Array<{ hour: string; attacks: number }>;
  alerts: Array<{
    type: string;
    icon: string;
    title: string;
    message: string;
    timestamp: string;
  }>;
  aiInsights: Array<{
    type: string;
    icon: string;
    text: string;
    action: string;
  }>;
}

export default function AIDefense() {
  const [landscape, setLandscape] = useState<ThreatLandscape | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchIP, setSearchIP] = useState('');
  const [ipAnalysis, setIpAnalysis] = useState<any>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [landscapeRes, predictionsRes] = await Promise.all([
        aiApi.getLandscape(),
        aiApi.getPredictions()
      ]);
      setLandscape(landscapeRes.data);
      setPredictions(predictionsRes.data.predictions || []);
    } catch (error: any) {
      toast.error('Failed to load AI defense data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAnalyzeIP = async () => {
    if (!searchIP.trim()) {
      toast.error('Please enter an IP address');
      return;
    }
    try {
      const res = await aiApi.analyzeIP(searchIP);
      setIpAnalysis(res.data);
      toast.success(`IP ${searchIP} analyzed`);
    } catch (error: any) {
      toast.error('Analysis failed');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-blue-400';
    return 'text-green-400';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-900/30 text-red-400 border-red-600';
      case 'high': return 'bg-orange-900/30 text-orange-400 border-orange-600';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'low': return 'bg-blue-900/30 text-blue-400 border-blue-600';
      case 'safe': return 'bg-green-900/30 text-green-400 border-green-600';
      default: return 'bg-slate-900/30 text-slate-400 border-slate-600';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-600 bg-red-900/20';
      case 'warning': return 'border-yellow-600 bg-yellow-900/20';
      case 'success': return 'border-green-600 bg-green-900/20';
      default: return 'border-slate-600 bg-slate-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with AI branding */}
        <div className="bg-gradient-to-r from-purple-900/50 via-cyan-900/50 to-blue-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl animate-pulse">🧠</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI Defense System
                </h1>
              </div>
              <p className="text-slate-300">Intelligent Threat Intelligence & Predictive Security</p>
            </div>
            <div className="flex gap-2">
              <button onClick={loadData} disabled={loading} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all">
                {loading ? '⏳' : '🔄'} Refresh
              </button>
              <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Global Threat Score - Hero Section */}
        {landscape && (
          <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle
                      cx="64" cy="64" r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(landscape.globalThreatScore / 100) * 351.86} 351.86`}
                      className={getScoreColor(landscape.globalThreatScore)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className={`text-4xl font-bold ${getScoreColor(landscape.globalThreatScore)}`}>
                      {landscape.globalThreatScore}
                    </div>
                    <div className="text-xs text-slate-400">THREAT SCORE</div>
                  </div>
                </div>
                <div>
                  <div className={`px-4 py-2 rounded-lg border inline-block mb-2 ${getRiskColor(landscape.globalRiskLevel)}`}>
                    <span className="text-sm font-bold uppercase">
                      {landscape.globalRiskLevel} RISK
                    </span>
                  </div>
                  <div className="text-slate-300 text-sm">
                    Global Security Posture
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{landscape.stats.totalAttacks}</div>
                  <div className="text-xs text-slate-400">Total Attacks</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">{landscape.stats.uniqueAttackers}</div>
                  <div className="text-xs text-slate-400">Unique IPs</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">{landscape.stats.attackVectors}</div>
                  <div className="text-xs text-slate-400">Attack Vectors</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Alerts */}
        {landscape && landscape.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>🔔</span> AI Alerts
            </h2>
            <div className="space-y-3">
              {landscape.alerts.map((alert, idx) => (
                <div key={idx} className={`border rounded-xl p-4 ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{alert.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-white mb-1">{alert.title}</div>
                      <div className="text-sm text-slate-300">{alert.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attack Distribution */}
          {landscape && (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>📊</span> Attack Distribution
              </h2>
              <div className="space-y-3">
                {landscape.attackDistribution.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white capitalize font-medium">{item.type}</span>
                      <span className="text-slate-400">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {landscape.attackDistribution.length === 0 && (
                  <div className="text-center text-slate-500 py-8">No attack data yet</div>
                )}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {landscape && (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>💡</span> AI Insights
              </h2>
              <div className="space-y-3">
                {landscape.aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div className="flex-1">
                        <div
                          className="text-sm text-slate-200 mb-2"
                          dangerouslySetInnerHTML={{ __html: insight.text }}
                        />
                        <div className="text-xs text-cyan-400">
                          💭 Recommended: {insight.action}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {landscape.aiInsights.length === 0 && (
                  <div className="text-center text-slate-500 py-8">Collecting intelligence...</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Top Threats */}
        {landscape && landscape.topThreats.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>🎯</span> Top Threats
            </h2>
            <div className="space-y-3">
              {landscape.topThreats.slice(0, 5).map((threat, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${getRiskColor(threat.riskLevel)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono font-bold text-white">{threat.ip}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {threat.totalAttacks} attacks • {threat.uniqueAttackTypes} vectors
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-2xl font-bold ${getScoreColor(threat.threatScore)}`}>
                        {threat.threatScore}
                      </div>
                      <div className="text-xs uppercase font-bold">{threat.riskLevel}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs font-bold text-slate-300 mb-1">
                      🎯 {threat.recommendation.action.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-slate-400">{threat.recommendation.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              <span>🔮</span> Predictive Threat Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred, idx) => (
                <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-white capitalize">{pred.attackType}</div>
                    <div className={`text-sm font-bold ${getScoreColor(pred.confidence)}`}>
                      {pred.confidence}% conf
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 mb-2">
                    Expected: <span className="text-cyan-400 font-bold">{pred.expectedFrequency}</span> attacks
                  </div>
                  <div className="text-xs text-purple-300">
                    💡 {pred.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IP Analyzer */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <span>🔍</span> Deep IP Analysis
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              placeholder="Enter IP address to analyze..."
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
            <button
              onClick={handleAnalyzeIP}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
            >
              🧠 Analyze
            </button>
          </div>

          {ipAnalysis && (
            <div className={`p-4 rounded-xl border ${getRiskColor(ipAnalysis.riskLevel)}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-mono text-xl font-bold text-white">{ipAnalysis.ip}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {ipAnalysis.totalAttacks} attacks • {ipAnalysis.uniqueAttackTypes} attack types
                  </div>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(ipAnalysis.threatScore)}`}>
                  {ipAnalysis.threatScore}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-sm font-bold text-white mb-1">
                  🎯 Recommended Action: {ipAnalysis.recommendation.action.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-slate-300 mb-2">{ipAnalysis.recommendation.reason}</div>
                <div className="space-y-1 mt-2">
                  {ipAnalysis.recommendation.steps.map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
