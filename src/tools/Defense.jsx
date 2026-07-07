import { useState, useEffect } from 'react'
import { getDreamOSStats } from '../services/dreamos-data'
export default function Defense() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    setStats(getDreamOSStats())
    const interval = setInterval(() => setStats(getDreamOSStats()), 5000)
    return () => clearInterval(interval)
  }, [])
  if (!stats) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk data.</div>
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🛡️ Defense Shield</h1>
      <p>Active Users: <strong style={{color:'#10b981'}}>{stats.activeUsers}</strong></p>
      <p>Bound Devices: <strong style={{color:'#10b981'}}>{stats.boundDevices}</strong></p>
      <p>Security Events: <strong style={{color:'#f59e0b'}}>{stats.securityEvents}</strong></p>
      <p>Last Attack: <strong style={{color:'#ef4444'}}>{stats.lastAttack ? new Date(stats.lastAttack).toLocaleString('id-ID') : 'None'}</strong></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  )
}
