import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Terminal, Cpu, Wifi } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setScanComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-[scan_3s_ease-in-out_infinite] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-1 bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-[scan_3s_ease-in-out_infinite_0.5s] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-1 bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-[scan_3s_ease-in-out_infinite_1s] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-[float_10s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-2xl mb-6 shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-[pulse_2s_ease-in-out_infinite]">
            <img
              src="/icon-192.png"
              alt="DREAMS Logo"
              className="w-16 h-16 object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3 animate-[glow_2s_ease-in-out_infinite]">
            DREAMS
          </h1>
          <p className="text-slate-400 text-sm tracking-wider uppercase">
            Digital Real Enterprise Alternative Management System
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-cyan-400">
            <Wifi className="w-4 h-4 animate-pulse" />
            <span>SYSTEM ONLINE</span>
            <span className="mx-2">|</span>
            <Cpu className="w-4 h-4" />
            <span>v1.0.0</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-mono text-cyan-400">AUTHENTICATION_TERMINAL</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 animate-[shake_0.5s_ease-in-out]">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
                {'>'} User_Identity_Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamos.dev"
                required
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 font-mono text-sm transition-all hover:border-cyan-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-mono">AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-mono">INITIATE_LOGIN_SEQUENCE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-xs text-cyan-400 text-center font-mono mb-3 uppercase tracking-wider">
              // DEMO_ACCESS_CREDENTIALS
            </p>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-400 text-center">
                Email: <code className="text-cyan-400 bg-slate-950/50 px-2 py-1 rounded">admin@dreamos.dev</code>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-600 text-xs font-mono">
            © 2026 DREAMS Enterprise. System ID: <span className="text-cyan-600">DRE-ENT-001</span>
          </p>
          <p className="text-slate-700 text-[10px] mt-1 font-mono">
            Secured by DreamOS Architecture
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(100vh); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(-100vh) translateX(50px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(6,182,212,0.5)); }
          50% { filter: drop-shadow(0 0 30px rgba(6,182,212,0.8)); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
