import { useState, useEffect } from 'react';
import { Shield, Radio, Wifi, AlertTriangle, CheckCircle, Activity, Lock, Eye, Signal, Zap } from 'lucide-react';

export default function MobileDefense() {
  const [threats, setThreats] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [signalStrength, setSignalStrength] = useState(85);
  const [towerId, setTowerId] = useState('TOWER-ID-4829');
  const [imsiExposed, setImsiExposed] = useState(false);
  const [fakeTowers, setFakeTowers] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulasi scanning
  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setScanning(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  // Simulasi threat detection
  useEffect(() => {
    if (scanning && scanProgress === 50) {
      // Simulasi deteksi anomali
      const hasAnomaly = Math.random() > 0.7;
      if (hasAnomaly) {
        setThreats([
          {
            id: 1,
            type: 'SIGNAL_ANOMALY',
            severity: 'MEDIUM',
            message: 'Unusual signal strength fluctuation detected',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    }
  }, [scanProgress, scanning]);

  const startScan = () => {
    setScanning(true);
    setThreats([]);
    setFakeTowers([]);
  };

  const securityScore = Math.max(0, 100 - (threats.length * 15) - (fakeTowers.length * 25));

  return (
    <div className="min-h-screen bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      {/* Scanner Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-[scan_8s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                MOBILE DEFENSE SYSTEM
              </h1>
              <p className="text-slate-400 text-sm">Real-time cellular network protection & threat detection</p>
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Security Score</h2>
              <p className="text-slate-400 text-sm">Overall protection status</p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${securityScore > 70 ? 'text-green-400' : securityScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {securityScore}
              </div>
              <p className="text-slate-400 text-xs">/ 100</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${securityScore > 70 ? 'bg-green-500' : securityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${securityScore}%` }}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyan-400" />
              Network Scanner
            </h2>
            <button
              onClick={startScan}
              disabled={scanning}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Start Defense Scan
                </>
              )}
            </button>
          </div>

          {/* Scan Progress */}
          {scanning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Scanning cellular network...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Network Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-slate-400">Signal Strength</span>
              </div>
              <div className="text-2xl font-bold text-white">{signalStrength}%</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">Connected Tower</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{towerId}</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-400">IMSI Protection</span>
              </div>
              <div className={`text-lg font-bold ${imsiExposed ? 'text-red-400' : 'text-green-400'}`}>
                {imsiExposed ? 'EXPOSED' : 'PROTECTED'}
              </div>
            </div>
          </div>
        </div>

        {/* Threat Detection */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            Threat Detection
          </h2>

          {threats.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-green-400 font-semibold text-lg">No Threats Detected</p>
              <p className="text-slate-400 text-sm mt-2">Your cellular connection is secure</p>
            </div>
          ) : (
            <div className="space-y-3">
              {threats.map(threat => (
                <div key={threat.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{threat.type}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          threat.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                          threat.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {threat.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{threat.message}</p>
                      <p className="text-slate-500 text-xs mt-2">{threat.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Defense Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Eye, title: 'Fake Tower Detector', desc: 'Detect IMSI catchers', color: 'cyan' },
            { icon: Activity, title: 'Signal Monitor', desc: 'Anomaly detection', color: 'blue' },
            { icon: Lock, title: 'IMSI Shield', desc: 'Prevent exposure', color: 'purple' },
            { icon: Wifi, title: 'Network Analyzer', desc: 'Handshake inspection', color: 'green' },
          ].map((module, idx) => (
            <div key={idx} className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-pointer group">
              <div className={`w-12 h-12 bg-gradient-to-br from-${module.color}-500 to-${module.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-1">{module.title}</h3>
              <p className="text-slate-400 text-sm">{module.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-xs">
          <p>DREAMS Mobile Defense System v1.0 | Educational & Defensive Use Only</p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
