import { useState, useEffect } from 'react'
import { getDreamOSStats } from '../services/dreamos-data'
export default function Honeypot() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    setStats(getDreamOSStats())
    const interval = setInterval(() => setStats(getDreamOSStats()), 5000)
    return () => clearInterval(interval)
  }, [])
  if (!stats) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk data.</div>
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🍯 Honeypot Trap</h1>
      <p>Honeypot Triggers: <strong style={{color:'#ef4444'}}>{stats.honeypotTriggers}</strong></p>
      <p>Potential Attackers: <strong>{stats.blockedIPs}</strong></p>
      <p>Status: <span style={{color:'#10b981'}}>ACTIVE</span></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  )
}
