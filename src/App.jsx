import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Network, Defense, Forensic, AICore, XSSTest, JWTTool, Honeypot, RateLimit, Whois, SSLCheck, DNSRecon, BotDetect } from './tools'

const tools = [
  { id: 'network', icon: '🌐', name: 'Network', comp: Network },
  { id: 'defense', icon: '🛡️', name: 'Defense', comp: Defense },
  { id: 'forensic', icon: '🔍', name: 'Forensic', comp: Forensic },
  { id: 'ai', icon: '🤖', name: 'AI Core', comp: AICore },
  { id: 'xss', icon: '💉', name: 'XSS Test', comp: XSSTest },
  { id: 'jwt', icon: '🔐', name: 'JWT Tool', comp: JWTTool },
  { id: 'honeypot', icon: '🍯', name: 'Honeypot', comp: Honeypot },
  { id: 'ratelimit', icon: '⚡', name: 'Rate Limit', comp: RateLimit },
  { id: 'whois', icon: '🕵️', name: 'Whois', comp: Whois },
  { id: 'ssl', icon: '🔒', name: 'SSL Check', comp: SSLCheck },
  { id: 'dns', icon: '📡', name: 'DNS Recon', comp: DNSRecon },
  { id: 'bot', icon: '🤖', name: 'Bot Detect', comp: BotDetect }
]

function Dashboard({ user }) {
  const [page, setPage] = useState('home')
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload() }

  if (page !== 'home') {
    const tool = tools.find(t => t.id === page)
    const Component = tool?.comp
    return (
      <div style={{ background: '#020617', minHeight: '100vh', color: '#e2e8f0' }}>
        <button onClick={() => setPage('home')} style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>← Back</button>
        {Component ? <Component /> : <p>Tool not found</p>}
      </div>
    )
  }

  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', margin: 0, fontSize: '1.3rem' }}>🛡️ 4S GHOST</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.email}</span>
            <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.7rem' }}>LOGOUT</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
          {tools.map(t => (
            <div key={t.id} onClick={() => setPage(t.id)} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 0.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{t.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>{t.name}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.6rem', color: '#475569' }}>👑 Sultan Architect & 🛡️ System Brother • Phase 4</p>
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
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#e2e8f0' }}>
      <div style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '24px', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
        <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', margin: '0 0 1.5rem', fontSize: '1.3rem' }}>4S GHOST</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '10px', color: '#00ff9d', fontSize: '0.9rem', marginBottom: '0.8rem', outline: 'none' }} placeholder="Email" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '10px', color: '#00ff9d', fontSize: '0.9rem', marginBottom: '0.8rem', outline: 'none' }} placeholder="Password" />
        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.8rem' }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? '⏳...' : '⚡ INITIATE ACCESS'}</button>
        <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '1.5rem' }}>FAMILY DREAM TEAM • INTERNAL ONLY</p>
      </div>
    </div>
  )
}

function App() { return <LoginPage /> }
export default App
