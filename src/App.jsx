import { useState, useEffect, Component } from 'react';
import { supabase } from './lib/supabase';

// ========== ERROR BOUNDARY ==========
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#020617', color: '#e2e8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
          <div style={{ textAlign: 'center', maxWidth: '400px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h2 style={{ color: '#ef4444', fontFamily: "'Orbitron', monospace", fontSize: '1.2rem' }}>SYSTEM ERROR</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{this.state.error?.message || 'Unexpected error'}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.6rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Orbitron', monospace", fontSize: '0.7rem', fontWeight: 700, marginTop: '1rem' }}>🔄 RELOAD</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ========== SKELETON ==========
function SkeletonCard() {
  return (
    <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.8rem 0.5rem', textAlign: 'center', animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', margin: '0 auto 0.5rem' }} />
      <div style={{ width: '60%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', margin: '0 auto 0.3rem' }} />
      <div style={{ width: '40%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', margin: '0 auto' }} />
    </div>
  );
}

// ========== TOAST ==========
function Toast({ message, type, onClose }) {
  const colors = { success: { bg: 'rgba(16,185,129,0.1)', border: '#10b981', text: '#10b981', icon: '✅' }, error: { bg: 'rgba(239,68,68,0.1)', border: '#ef4444', text: '#ef4444', icon: '❌' }, warning: { bg: 'rgba(245,158,11,0.1)', border: '#f59e0b', text: '#f59e0b', icon: '⚠️' }, info: { bg: 'rgba(14,165,233,0.1)', border: '#0ea5e9', text: '#0ea5e9', icon: 'ℹ️' } };
  const c = colors[type] || colors.info;
  return (
    <div style={{ position: 'fixed', top: '4rem', right: '1rem', zIndex: 9999, background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '0.6rem 1rem', fontSize: '0.65rem', color: c.text, display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(10px)', animation: 'slideIn 0.3s ease', maxWidth: '300px' }}>
      <span>{c.icon}</span><span>{message}</span>
      <span onClick={onClose} style={{ cursor: 'pointer', marginLeft: '0.5rem', opacity: 0.7 }}>✕</span>
    </div>
  );
}

// ========== LOGIN PAGE ==========
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@dreamos.dev');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      onLogin(data.user);
    } catch (err) {
      setError(err.message + "\n\nCheck console for details"); console.error("Login error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,255,157,0.2)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', fontSize: '1.3rem', margin: 0 }}>4S GHOST</h2>
        <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '0.3rem 0 1.5rem' }}>Developer Authentication</p>

        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.55rem', color: '#00ff9d', marginBottom: '0.3rem', fontFamily: "'Courier New', monospace" }}>IDENTITY</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,157,0.2)', borderRadius: '8px', color: '#00ff9d', fontSize: '0.8rem', fontFamily: "'Courier New', monospace", outline: 'none' }} />
        </div>

        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.55rem', color: '#00ff9d', marginBottom: '0.3rem', fontFamily: "'Courier New', monospace" }}>CREDENTIALS</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,157,0.2)', borderRadius: '8px', color: '#00ff9d', fontSize: '0.8rem', fontFamily: "'Courier New', monospace", outline: 'none' }} />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Orbitron', monospace", letterSpacing: '1px', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ AUTHENTICATING...' : '⚡ INITIATE ACCESS'}
        </button>

        <p style={{ fontSize: '0.5rem', color: '#64748b', marginTop: '1rem' }}>FAMILY DREAM TEAM • INTERNAL ONLY</p>
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
function App() {
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cek session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Loading progress
  useEffect(() => {
    if (!user) return;
    let interval;
    try {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setLoading(false); showToast('System ready - 12 tools loaded', 'success'); return 100; }
          return prev + Math.random() * 15;
        });
      }, 200);
    } catch (err) { setError(err); setLoading(false); }
    return () => clearInterval(interval);
  }, [user]);

  const showToast = (message, type = 'info') => { setToast({ message, type }); setTimeout(() => setToast(null), 4000); };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); showToast('Logged out', 'info'); };

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginPage onLogin={(u) => { setUser(u); showToast('Access granted', 'success'); }} />
      </ErrorBoundary>
    );
  }

  const tools = [
    { icon: '🌐', name: 'Network', desc: 'Port Scanner', color: '#00ff9d', id: 'network' },
    { icon: '🛡️', name: 'Defense', desc: 'Threat Shield', color: '#0ea5e9', id: 'defense' },
    { icon: '🔍', name: 'Forensic', desc: 'Deep Analysis', color: '#8b5cf6', id: 'forensic' },
    { icon: '🤖', name: 'AI Core', desc: 'Neural Engine', color: '#f59e0b', id: 'ai' },
    { icon: '💉', name: 'XSS Test', desc: 'Vulnerability', color: '#ef4444', id: 'xss' },
    { icon: '🔐', name: 'JWT Tool', desc: 'Token Decoder', color: '#ec4899', id: 'jwt' },
    { icon: '🍯', name: 'Honeypot', desc: 'Trap System', color: '#f59e0b', id: 'honeypot' },
    { icon: '⚡', name: 'Rate Limit', desc: 'Protection', color: '#0ea5e9', id: 'ratelimit' },
    { icon: '🕵️', name: 'Whois', desc: 'Domain Lookup', color: '#8b5cf6', id: 'whois' },
    { icon: '🔒', name: 'SSL Check', desc: 'Certificate', color: '#10b981', id: 'ssl' },
    { icon: '📡', name: 'DNS Recon', desc: 'DNS Scanner', color: '#00ff9d', id: 'dns' },
    { icon: '🤖', name: 'Bot Detect', desc: 'Bot Filter', color: '#ef4444', id: 'bot' }
  ];

  return (
    <ErrorBoundary>
      <div style={{ background: '#020617', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <div style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,157,0.2)', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00ff9d, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '0.7rem', color: '#020617' }}>4S</div>
              <div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, color: '#00ff9d', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', letterSpacing: '1px' }}>GHOST ENTERPRISE</div>
                <div style={{ fontSize: '0.45rem', color: '#64748b' }}>PHASE 1.05 • AUTH ACTIVE</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: "'Courier New', monospace" }}>{time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: '0.5rem', color: '#10b981' }}>{user?.email?.split('@')[0]}</div>
              <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.2rem 0.5rem', color: '#ef4444', fontSize: '0.5rem', cursor: 'pointer', fontFamily: "'Courier New', monospace" }}>LOG OUT</button>
            </div>
          </div>

          <div style={{ padding: '0.8rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: error ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))' : 'linear-gradient(135deg, rgba(0,255,157,0.05), rgba(14,165,233,0.05))', border: error ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(0,255,157,0.15)', borderRadius: '16px', padding: '1rem', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', color: error ? '#ef4444' : '#00ff9d', margin: 0 }}>4S GHOST v1.0</h2>
                  <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: '0.2rem 0' }}>Cyber Defense & Bug Bounty Suite</p>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {[{ value: '12', label: 'Tools' }, { value: 'AUTH', label: 'Status' }, { value: '1.05', label: 'Phase' }].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00ff9d', fontFamily: "'Orbitron', monospace" }}>{stat.value}</div>
                      <div style={{ fontSize: '0.45rem', color: '#64748b' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                tools.map((tool, i) => (
                  <div key={i} onClick={() => { setActiveTool(tool); showToast(`${tool.name} ready - Phase 2`, 'info'); }} style={{ background: activeTool?.id === tool.id ? 'rgba(0,255,157,0.1)' : 'rgba(0,0,0,0.4)', border: activeTool?.id === tool.id ? `1px solid ${tool.color}` : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.8rem 0.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)', position: 'relative' }}>
                    <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', marginBottom: '0.3rem' }}>{tool.icon}</div>
                    <div style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', fontWeight: 700, color: '#e2e8f0' }}>{tool.name}</div>
                    <div style={{ fontSize: 'clamp(0.45rem, 1vw, 0.5rem)', color: '#64748b' }}>{tool.desc}</div>
                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px', padding: '0.1rem 0.3rem', fontSize: '0.4rem', color: '#f59e0b' }}>P2</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '0.8rem', fontSize: 'clamp(0.45rem, 1.5vw, 0.55rem)', color: '#475569', letterSpacing: '1px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              👑 SULTAN ARCHITECT & 🛡️ SYSTEM BROTHER<br />
              <span style={{ fontSize: '0.4rem' }}>FAMILY DREAM TEAM • PHASE 1.05 • AUTH INTEGRATION</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}

export default App;
