import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [email, setEmail] = useState('dreamos.sch.id@gmail.com')
  const [pass, setPass] = useState('b15m1ll4h_012443410')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
      setChecking(false)
    })
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (err) throw err
      setUser(data.user)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (checking) return <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff9d', fontFamily: 'monospace' }}>⏳ Checking session...</div>

  if (!user) {
    return (
      <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#e2e8f0' }}>
        <div style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', margin: '0 0 1.5rem', fontSize: '1.5rem' }}>4S GHOST</h1>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '10px', color: '#00ff9d', fontSize: '0.9rem', marginBottom: '0.8rem', outline: 'none' }} placeholder="Email" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid rgba(0,255,157,0.3)', borderRadius: '10px', color: '#00ff9d', fontSize: '0.9rem', marginBottom: '0.8rem', outline: 'none' }} placeholder="Password" />
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.8rem' }}>{error}</p>}
          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? '⏳...' : '⚡ INITIATE ACCESS'}</button>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1.5rem' }}>FAMILY DREAM TEAM • INTERNAL ONLY</p>
        </div>
      </div>
    )
  }

  // Dashboard setelah login
  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Orbitron', monospace", color: '#00ff9d', margin: 0 }}>🛡️ 4S GHOST DASHBOARD</h1>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>🚪 LOGOUT</button>
        </div>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Logged in as: <strong style={{ color: '#00ff9d' }}>{user.email}</strong></p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.8rem' }}>
          {['🌐 Network','🛡️ Defense','🔍 Forensic','🤖 AI Core','💉 XSS Test','🔐 JWT Tool','🍯 Honeypot','⚡ Rate Limit','🕵️ Whois','🔒 SSL Check','📡 DNS Recon','🤖 Bot Detect'].map((t, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{t.split(' ')[0]}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>{t.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.6rem', color: '#475569' }}>👑 Sultan Architect & 🛡️ System Brother • Phase 1 COMPLETE</p>
      </div>
    </div>
  )
}

export default App
