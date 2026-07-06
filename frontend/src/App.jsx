import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('admin@dreamos.dev');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert('🔐 Login attempted with: ' + email);
  };

  return (
    <div style={{
      background: '#0a0e27',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Starfield background */}
      <canvas id="star-field" style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%'
      }}>
        {/* Glass panel */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 157, 0.1)'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 157, 0.5))'
          }}>
            🛡️
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#00ff9d',
            textShadow: '0 0 30px rgba(0, 255, 157, 0.5)',
            marginBottom: '0.3rem',
            letterSpacing: '2px'
          }}>
            4S GHOST
          </h1>
          
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            Enterprise Defense System
          </div>

          {/* Status badge */}
          <div style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            fontSize: '0.65rem',
            color: '#10b981',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '1.5rem',
            animation: 'pulse 2s infinite'
          }}>
            🟢 SYSTEM ONLINE • v1.0.0
          </div>

          {/* Email input */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{
              fontSize: '0.6rem',
              color: '#00ff9d',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '0.3rem',
              fontFamily: "'Orbitron', monospace"
            }}>
              ▸ USER IDENTITY
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(0, 255, 157, 0.2)',
                borderRadius: '12px',
                color: '#00ff9d',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                outline: 'none'
              }}
            />
          </div>

          {/* Password input */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{
              fontSize: '0.6rem',
              color: '#00ff9d',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '0.3rem',
              fontFamily: "'Orbitron', monospace"
            }}>
              ▸ ACCESS CREDENTIALS
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(0, 255, 157, 0.2)',
                borderRadius: '12px',
                color: '#00ff9d',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                outline: 'none'
              }}
            />
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 25px rgba(16, 185, 129, 0.4)',
              marginTop: '0.5rem'
            }}
          >
            ⚡ INITIATE ACCESS
          </button>

          {/* Demo info */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.8rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            fontSize: '0.65rem',
            color: '#f59e0b',
            textAlign: 'left'
          }}>
            <strong>🔑 DEMO ACCESS:</strong><br />
            <code style={{ color: '#00ff9d', fontSize: '0.6rem' }}>Email: admin@dreamos.dev</code>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginTop: '1.5rem'
          }}>
            {[
              { value: '70+', label: 'Tools' },
              { value: '24/7', label: 'Monitor' },
              { value: 'AI', label: 'Defense' }
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '0.6rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00ff9d' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.5rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.6rem',
          color: '#64748b',
          letterSpacing: '1px'
        }}>
          © 2026 DREAMS Enterprise • System ID: DRE-ENT-001 • ISO 27001
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}

export default App;
