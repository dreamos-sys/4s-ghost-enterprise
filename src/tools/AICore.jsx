import { useState, useEffect } from 'react'
import { getDreamOSStats } from '../services/dreamos-data'
export default function AICore() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    setStats(getDreamOSStats())
    const interval = setInterval(() => setStats(getDreamOSStats()), 5000)
    return () => clearInterval(interval)
  }, [])
  if (!stats) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk data.</div>
  const threatLevel = stats.pendingK3 > 5 || stats.pendingDana > 5 ? 'HIGH' : stats.securityEvents > 10 ? 'MEDIUM' : 'LOW'
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🤖 AI Defense Engine</h1>
      <p>Threat Level: <strong style={{color:threatLevel==='HIGH'?'#ef4444':threatLevel==='MEDIUM'?'#f59e0b':'#10b981'}}>{threatLevel}</strong></p>
      <p>Pending Issues: <strong>{stats.pendingK3 + stats.pendingDana}</strong></p>
      <p>Recommendation: <strong style={{color:'#0ea5e9'}}>{threatLevel === 'HIGH' ? 'Segera tindak lanjuti K3 dan Dana!' : threatLevel === 'MEDIUM' ? 'Monitor ketat.' : 'Semua normal.'}</strong></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  )
}
