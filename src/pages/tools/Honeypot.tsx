import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { honeypotApi } from '../../services/api';
import toast from 'react-hot-toast';

interface Stats {
  totalAttacks: number;
  uniqueAttackers: number;
  byType: Array<{ type: string; count: number }>;
  topIPs: Array<{ ip: string; count: number }>;
  topUserAgents: Array<{ ua: string; count: number }>;
}

interface Log {
  id: number;
  ip: string;
  user_agent: string;
  method: string;
  path: string;
  attack_type: string;
  payload: string;
  created_at: string;
}

export default function Honeypot() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        honeypotApi.getStats(timeRange),
        honeypotApi.getLogs(50, 0)
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data.logs);
    } catch (error: any) {
      toast.error('Failed to load honeypot data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [timeRange]);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all honeypot logs?')) return;
    try {
      await honeypotApi.clearLogs();
      toast.success('Logs cleared');
      loadData();
    } catch (error: any) {
      toast.error('Failed to clear logs');
    }
  };

  const getAttackColor = (type: string) => {
    switch (type) {
      case 'sqli': return 'text-red-400 bg-red-900/30';
      case 'xss': return 'text-orange-400 bg-orange-900/30';
      case 'traversal': return 'text-yellow-400 bg-yellow-900/30';
      case 'scan': return 'text-blue-400 bg-blue-900/30';
      default: return 'text-slate-400 bg-slate-900/30';
    }
  };

  const getAttackIcon = (type: string) => {
    switch (type) {
      case 'sqli': return '🗄️';
      case 'xss': return '💉';
      case 'traversal': return '📂';
      case 'scan': return '🔍';
      default: return '👾';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🍯 Honeypot Dashboard</h1>
              <p className="text-slate-400">Monitor attacker activity and trap malicious requests</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
                ← Back
              </button>
              <button onClick={handleClearLogs} className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all">
                🗑️ Clear Logs
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['1h', '24h', '7d', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 Days' : 'All Time'}
            </button>
          ))}
          <button onClick={loadData} disabled={loading} className="ml-auto px-4 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Total Attacks</div>
              <div className="text-4xl font-bold text-cyan-400">{stats.totalAttacks}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Unique Attackers</div>
              <div className="text-4xl font-bold text-purple-400">{stats.uniqueAttackers}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Attack Types</div>
              <div className="text-4xl font-bold text-orange-400">{stats.byType.length}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-1">Top Attacker</div>
              <div className="text-lg font-bold text-red-400 truncate">{stats.topIPs[0]?.ip || 'N/A'}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attack Types Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Attack Types</h2>
            {stats?.byType.length ? (
              <div className="space-y-3">
                {stats.byType.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getAttackIcon(item.type)}</span>
                      <span className={`font-medium capitalize ${getAttackColor(item.type).split(' ')[0]}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-white">{item.count}</div>
                      <div className="text-xs text-slate-400">attacks</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">No attacks detected yet</div>
            )}
          </div>

          {/* Top Attackers */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🎯 Top Attackers</h2>
            {stats?.topIPs.length ? (
              <div className="space-y-2">
                {stats.topIPs.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-slate-500">#{idx + 1}</div>
                      <div className="font-mono text-sm text-white">{item.ip}</div>
                    </div>
                    <div className="px-3 py-1 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                      {item.count} attacks
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">No attackers yet</div>
            )}
          </div>
        </div>

        {/* Recent Attacks Log */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">📋 Recent Attacks</h2>
          {logs.length ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAttackIcon(log.attack_type)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getAttackColor(log.attack_type)}`}>
                        {log.attack_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{log.method}</span>
                    </div>
                    <div className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">IP: </span>
                      <span className="text-white font-mono">{log.ip}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Path: </span>
                      <span className="text-cyan-400 font-mono">{log.path}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 truncate">
                    UA: {log.user_agent}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              <div className="text-4xl mb-2">🍯</div>
              No attacks logged yet. Honeypot is waiting...
            </div>
          )}
        </div>

        {/* Honeypot Endpoints Info */}
        <div className="mt-8 bg-yellow-900/10 border border-yellow-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Active Honeypot Endpoints</h3>
          <p className="text-sm text-slate-400 mb-3">These endpoints trap attackers. Share them to attract attacks:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
            {['/honeypot/admin', '/honeypot/wp-admin', '/honeypot/.env', '/honeypot/phpmyadmin',
              '/honeypot/shell.php', '/honeypot/.git/config', '/honeypot/backup.sql', '/honeypot/console'].map(ep => (
              <div key={ep} className="p-2 bg-slate-900/50 rounded text-yellow-400 truncate">{ep}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
