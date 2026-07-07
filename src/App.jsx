import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Network, Defense, Forensic, AICore, XSSTest, JWTTool, Honeypot, RateLimit, Whois, SSLCheck, DNSRecon, BotDetect } from './tools'
import './index.css'

const tools = [
  { id: 'network', icon: '🌐', name: 'Network Scanner', desc: 'Port scanning', comp: Network },
  { id: 'defense', icon: '🛡️', name: 'Defense Shield', desc: 'Threat protection', comp: Defense },
  { id: 'forensic', icon: '🔍', name: 'Forensic', desc: 'Deep analysis', comp: Forensic },
  { id: 'ai', icon: '🤖', name: 'AI Core', desc: 'Neural engine', comp: AICore },
  { id: 'xss', icon: '💉', name: 'XSS Scanner', desc: 'Vulnerability test', comp: XSSTest },
  { id: 'jwt', icon: '🔐', name: 'JWT Decoder', desc: 'Token analyzer', comp: JWTTool },
  { id: 'honeypot', icon: '🍯', name: 'Honeypot', desc: 'Trap system', comp: Honeypot },
  { id: 'ratelimit', icon: '⚡', name: 'Rate Limiter', desc: 'DDoS protection', comp: RateLimit },
  { id: 'whois', icon: '🕵️', name: 'Whois Lookup', desc: 'Domain info', comp: Whois },
  { id: 'ssl', icon: '🔒', name: 'SSL Check', desc: 'Certificate verify', comp: SSLCheck },
  { id: 'dns', icon: '📡', name: 'DNS Recon', desc: 'DNS scanner', comp: DNSRecon },
  { id: 'bot', icon: '🤖', name: 'Bot Detect', desc: 'Bot filter', comp: BotDetect }
]

function Dashboard({ user }) {
  const [page, setPage] = useState('home')
  const [time, setTime] = useState(new Date())
  const [showNotification, setShowNotification] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setTimeout(() => setShowNotification(false), 5000)
  }, [])

  const handleLogout = async () => {
    if (confirm('Yakin ingin logout?')) {
      await supabase.auth.signOut()
      window.location.reload()
    }
  }

  if (page !== 'home') {
    const tool = tools.find(t => t.id === page)
    const Component = tool?.comp
    return (
      <div style={{ background: '#020617', minHeight: '100vh', color: '#e2e8f0' }}>
        <button className="back-button" onClick={() => setPage('home')}>← Back to Dashboard</button>
        {Component ? <Component /> : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="glass" style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tool?.icon}</div>
              <h2 style={{ color: '#00ff9d', fontFamily: "'Orbitron', monospace", marginBottom: '0.5rem' }}>{tool?.name}</h2>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{tool?.desc}</p>
              <p style={{ color: '#f59e0b' }}>🚧 Full version coming in Phase 8</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#e2e8f0', padding: '1rem', position: 'relative' }}>
      {/* Welcome Notification */}
      {showNotification && (
        <div className="fade-in" style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000,
          background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px', padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <span>✅</span>
          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Welcome back, {user?.email?.split('@')[0] || 'Developer'}!</span>
          <span onClick={() => setShowNotification(false)} style={{ cursor: 'pointer', marginLeft: '0.5rem', opacity: 0.7 }}>✕</span>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div className="glass fade-in" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #00ff9d, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '0.8rem',
                color: '#020617'
              }}>4S</div>
              <div>
                <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', fontSize: '1.2rem', margin: 0 }}>
                  GHOST ENTERPRISE
                </h1>
                <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0 }}>Phase 7 • Premium Edition</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="status-online"></div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.email}</div>
            <button onClick={handleLogout} style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.7rem', transition: 'all 0.2s'
            }}>LOGOUT</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.8rem', marginBottom: '1.5rem'
        }}>
          {[
            { icon: '🛡️', value: '12', label: 'Active Tools', color: '#00ff9d' },
            { icon: '☁️', value: 'ON', label: 'Backend', color: '#0ea5e9' },
            { icon: '🔒', value: 'AUTH', label: 'Security', color: '#10b981' },
            { icon: '📱', value: 'v1.0', label: 'Version', color: '#8b5cf6' }
          ].map((stat, i) => (
            <div key={i} className="glass" style={{ textAlign: 'center', padding: '0.8rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: stat.color, fontFamily: "'Orbitron', monospace" }}>{stat.value}</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tools Grid */}
        <h2 style={{ color: '#00ff9d', fontSize: '0.9rem', marginBottom: '0.8rem', fontFamily: "'Orbitron', monospace", letterSpacing: '1px' }}>
          🔧 SECURITY TOOLS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.8rem', marginBottom: '2rem' }}>
          {tools.map(t => (
            <div key={t.id} className="tool-card glass" onClick={() => setPage(t.id)} style={{
              textAlign: 'center', padding: '1.2rem 0.8rem', cursor: 'pointer'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', transition: 'transform 0.3s' }}>{t.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.2rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.55rem', color: '#64748b' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="glass" style={{ textAlign: 'center', padding: '1rem', fontSize: '0.6rem', color: '#475569' }}>
          👑 Sultan Architect & 🛡️ System Brother<br />
          <span style={{ color: '#64748b' }}>FAMILY DREAM TEAM • PHASE 7 • PREMIUM UI</span>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('dreamos.sch.id@gmail.com')
  const [pass, setPass] = useState('b15m1ll4h_012443410')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async () => {
    setLoading(true); setError('')
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (err) throw err
      setUser(data.user)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  if (user) return <Dashboard user={user} />

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', position: 'relative' }}>
      <div className="glass" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
        <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', margin: '0 0 0.3rem', fontSize: '1.5rem', letterSpacing: '3px' }}>4S GHOST</h1>
        <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '2rem', letterSpacing: '2px' }}>ENTERPRISE DEFENSE SYSTEM</p>
        <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ marginBottom: '0.8rem' }} />
        <input className="input-field" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" style={{ marginBottom: '0.8rem' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.8rem' }}>{error}</p>}
        <button className="action-button" onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
          {loading ? '⏳ AUTHENTICATING...' : '⚡ INITIATE ACCESS'}
        </button>
        <div style={{ marginTop: '1.5rem', padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', fontSize: '0.6rem', color: '#f59e0b' }}>
          🔐 INTERNAL USE ONLY • FAMILY DREAM TEAM
        </div>
      </div>
    </div>
  )
}

function App() { return <LoginPage /> }
export default App
