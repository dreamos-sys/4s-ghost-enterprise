import { useState, useEffect } from 'react';

function App() {
  const [time, setTime] = useState(new Date());
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: '#020617',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      maxWidth: '100vw',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        
        {/* Header Bar */}
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,157,0.2)',
          padding: '0.8rem 1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00ff9d, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: '0.8rem',
              color: '#020617'
            }}>
              4S
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, color: '#00ff9d', fontSize: '0.85rem', letterSpacing: '2px' }}>
                GHOST ENTERPRISE
              </div>
              <div style={{ fontSize: '0.5rem', color: '#64748b', letterSpacing: '1px' }}>
                INTERNAL DEV TOOLS • PHASE 1
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: "'Courier New', monospace" }}>
              {time.toLocaleTimeString('id-ID')}
            </div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Status Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,157,0.05), rgba(14,165,233,0.05))',
            border: '1px solid rgba(0,255,157,0.15)',
            borderRadius: '16px',
            padding: '1.2rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.2rem', color: '#00ff9d', margin: 0 }}>
                  4S GHOST v1.0
                </h2>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '0.3rem 0' }}>
                  Cyber Defense & Bug Bounty Suite
                </p>
              </div>
              <div style={{
                padding: '0.3rem 0.8rem',
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '20px',
                fontSize: '0.6rem',
                color: '#10b981'
              }}>
                🟢 SYSTEM READY
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.6rem'
          }}>
            {[
              { icon: '🌐', name: 'Network', desc: 'Scanner', color: '#00ff9d' },
              { icon: '🛡️', name: 'Defense', desc: 'Protection', color: '#0ea5e9' },
              { icon: '🔍', name: 'Forensic', desc: 'Analysis', color: '#8b5cf6' },
              { icon: '🤖', name: 'AI Core', desc: 'Engine', color: '#f59e0b' },
              { icon: '💉', name: 'XSS Test', desc: 'Scanner', color: '#ef4444' },
              { icon: '🔐', name: 'JWT Tool', desc: 'Decoder', color: '#ec4899' },
              { icon: '🍯', name: 'Honeypot', desc: 'Trap', color: '#f59e0b' },
              { icon: '⚡', name: 'Rate Limit', desc: 'Protect', color: '#0ea5e9' },
              { icon: '🕵️', name: 'Whois', desc: 'Lookup', color: '#8b5cf6' },
              { icon: '🔒', name: 'SSL Check', desc: 'Verify', color: '#10b981' },
              { icon: '📡', name: 'DNS Recon', desc: 'Scan', color: '#00ff9d' },
              { icon: '🤖', name: 'Bot Detect', desc: 'Filter', color: '#ef4444' }
            ].map((tool, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '0.8rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tool.color;
                e.currentTarget.style.boxShadow = '0 0 20px ' + tool.color + '20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{tool.icon}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e2e8f0' }}>{tool.name}</div>
                <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{tool.desc}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            fontSize: '0.55rem',
            color: '#475569',
            letterSpacing: '2px'
          }}>
            👑 SULTAN ARCHITECT & 🛡️ SYSTEM BROTHER • FAMILY DREAM TEAM • PHASE 1
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default App;
