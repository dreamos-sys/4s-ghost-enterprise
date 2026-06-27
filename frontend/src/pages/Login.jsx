import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Terminal, Cpu, Wifi } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  // Efek scanner animation saat load - LEBIH LAMBAT
  useEffect(() => {
    const timer = setTimeout(() => setScanComplete(true), 2000);
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
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Scanner Lines Effect - LEBIH LAMBAT (6 detik per cycle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,1)] animate-[scan_6s_ease-in-out_infinite] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-[scan_6s_ease-in-out_infinite_1s] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-[scan_6s_ease-in-out_infinite_2s] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-cyan-400/20 shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-[scan_6s_ease-in-out_infinite_3s] ${scanComplete ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Floating Particles - LEBIH LAMBAT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-[float_15s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl mb-6 shadow-[0_0_60px_rgba(6,182,212,0.6)] animate-[pulse_3s_ease-in-out_infinite] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
            <img 
              src="/icon-192.png" 
              alt="DREAMS Logo" 
              className="w-24 h-24 object-contain drop-shadow-2xl relative z-10"
            />
          </div>
          
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 animate-[glow_3s_ease-in-out_infinite] tracking-tight">
            DREAMS
          </h1>
          <p className="text-slate-300 text-base tracking-widest uppercase mb-2">
            Digital Real Enterprise Alternative Management System
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 mt-6 text-sm text-cyan-400 font-mono">
            <Wifi className="w-5 h-5 animate-pulse" />
            <span className="tracking-wider">SYSTEM ONLINE</span>
            <span className="text-slate-600">|</span>
            <Cpu className="w-5 h-5" />
            <span className="tracking-wider">v1.0.0</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-10 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
          {/* Terminal Header */}
          <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-700/60">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span className="text-base font-mono text-cyan-400 tracking-wider">AUTHENTICATION_TERMINAL</span>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-500/20 border border-red-500/60 rounded-xl flex items-center gap-3 text-red-400 animate-[shake_0.6s_ease-in-out]">
              <Shield className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm font-mono">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">
                {'>'} USER_IDENTITY_EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamos.dev"
                required
                className="w-full px-5 py-4 bg-slate-950/90 border border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 font-mono text-sm transition-all duration-300 hover:border-cyan-400/60"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 px-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-mono tracking-wider">AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-mono tracking-wider text-lg">INITIATE_LOGIN_SEQUENCE</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/40 rounded-xl">
            <p className="text-xs text-cyan-400 text-center font-mono mb-4 uppercase tracking-widest">
              // DEMO_ACCESS_CREDENTIALS
            </p>
            <div className="space-y-3 text-xs font-mono">
              <p className="text-slate-400 text-center">
                Email: <code className="text-cyan-400 bg-slate-950/60 px-3 py-1.5 rounded-lg">admin@dreamos.dev</code>
              </p>
              <p className="text-slate-400 text-center">
                Password: <code className="text-cyan-400 bg-slate-950/60 px-3 py-1.5 rounded-lg">admin123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-xs font-mono">
            © 2026 DREAMS Enterprise. System ID: <span className="text-cyan-600">DRE-ENT-001</span>
          </p>
          <p className="text-slate-700 text-[11px] mt-2 font-mono">
            Secured by DreamOS Architecture
          </p>
        </div>
      </div>

      {/* CSS Animations - SCANNER LEBIH LAMBAT */}
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
          0%, 100% { filter: drop-shadow(0 0 15px rgba(6,182,212,0.6)); }
          50% { filter: drop-shadow(0 0 40px rgba(6,182,212,1)); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
