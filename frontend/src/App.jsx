import { useState, useEffect } from 'react';

function App() {
  const [time, setTime] = useState(new Date());
  const [activeTool, setActiveTool] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    alert(`🔧 ${tool.name} - ${tool.desc}\n\n🚧 Coming in Phase 2!`);
  };

  return (
    <div style={{
      background: '#020617',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
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

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        
        {/* Header Bar */}
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,157,0.2)',
          padding: '0.6rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00ff9d, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: '0.7rem',
              color: '#020617'
            }}>
              4S
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, color: '#00ff9d', fontSize: '0.75rem', letterSpacing: '1px' }}>
                GHOST ENTERPRISE
              </div>
              <div style={{ fontSize: '0.5rem', color: '#64748b' }}>
                PHASE 1.02 • MOBILE READY
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: "'Courier New', monospace" }}>
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }} />
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid rgba(0,255,157,0.3)',
                borderRadius: '6px',
                padding: '0.3rem 0.5rem',
                color: '#00ff9d',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div style={{ padding: '0.8rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Status Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,157,0.05), rgba(14,165,233,0.05))',
            border: '1px solid rgba(0,255,157,0.15)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '0.8rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                  color: '#00ff9d',
                  margin: 0
                }}>
                  4S GHOST v1.0
                </h2>
                <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                  Cyber Defense & Bug Bounty Suite
                </p>
              </div>
              
              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {[
                  { value: '12', label: 'Tools' },
                  { value: '24/7', label: 'Ready' },
                  { value: 'v1.0', label: 'Phase 1' }
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#00ff9d',
                      fontFamily: "'Orbitron', monospace"
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.45rem', color: '#64748b' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Active tool indicator */}
            {activeTool && (
              <div style={{
                marginTop: '0.8rem',
                padding: '0.5rem 0.8rem',
                background: 'rgba(0,255,157,0.1)',
                border: '1px solid rgba(0,255,157,0.2)',
                borderRadius: '8px',
                fontSize: '0.6rem',
                color: '#00ff9d',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{activeTool.icon}</span>
                <span><strong>{activeTool.name}</strong> activated</span>
                <span style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setActiveTool(null)}>✕</span>
              </div>
            )}
          </div>

          {/* Tools Grid - RESPONSIVE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.5rem'
          }}>
            {tools.map((tool, i) => (
              <div key={i}
                onClick={() => handleToolClick(tool)}
                style={{
                  background: activeTool?.id === tool.id
                    ? 'rgba(0,255,157,0.1)'
                    : 'rgba(0,0,0,0.4)',
                  border: activeTool?.id === tool.id
                    ? `1px solid ${tool.color}`
                    : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '0.8rem 0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tool.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (activeTool?.id !== tool.id) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                  marginBottom: '0.3rem'
                }}>
                  {tool.icon}
                </div>
                <div style={{
                  fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)',
                  fontWeight: 700,
                  color: '#e2e8f0'
                }}>
                  {tool.name}
                </div>
                <div style={{
                  fontSize: 'clamp(0.45rem, 1vw, 0.5rem)',
                  color: '#64748b',
                  marginTop: '0.1rem'
                }}>
                  {tool.desc}
                </div>
                
                {/* Coming soon badge */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(245,158,11,0.2)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '4px',
                  padding: '0.1rem 0.3rem',
                  fontSize: '0.4rem',
                  color: '#f59e0b'
                }}>
                  P2
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            padding: '0.8rem',
            fontSize: 'clamp(0.45rem, 1.5vw, 0.55rem)',
            color: '#475569',
            letterSpacing: '1px',
            borderTop: '1px solid rgba(255,255,255,0.03)'
          }}>
            👑 SULTAN ARCHITECT & 🛡️ SYSTEM BROTHER<br />
            <span style={{ fontSize: '0.4rem' }}>FAMILY DREAM TEAM • PHASE 1.02 • MOBILE RESPONSIVE</span>
          </div>
        </div>
      </div>

      {/* Mobile responsive CSS */}
      <style>{`
        @media (max-width: 600px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
