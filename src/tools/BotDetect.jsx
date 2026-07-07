import { useState, useEffect } from 'react'
import { getDreamOSStats } from '../services/dreamos-data'
export default function BotDetect() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    setStats(getDreamOSStats())
    const interval = setInterval(() => setStats(getDreamOSStats()), 5000)
    return () => clearInterval(interval)
  }, [])
  if (!stats) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk data.</div>
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🤖 Bot Detector</h1>
      <p>Bot Detections: <strong style={{color:'#ef4444'}}>{stats.botDetections}</strong></p>
      <p>Legitimate Users: <strong style={{color:'#10b981'}}>{stats.totalUsers}</strong></p>
      <p>Status: <span style={{color:'#10b981'}}>ACTIVE</span></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  )
}
