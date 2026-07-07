import { useState, useEffect } from 'react'
import { getDreamOSStats } from '../services/dreamos-data'
export default function Forensic() {
  const [stats, setStats] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  useEffect(() => {
    const load = () => {
      setStats(getDreamOSStats())
      try {
        const logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]')
        setAuditLogs(logs.slice(0, 20))
      } catch(e) {}
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])
  if (!stats) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk data.</div>
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🔍 Forensic Analysis</h1>
      <p>Total Audit Logs: <strong style={{color:'#0ea5e9'}}>{stats.totalAudit}</strong></p>
      <p>Recent Logins: <strong>{stats.recentLogins}</strong></p>
      <h3 style={{color:'#00ff9d',marginTop:'1rem'}}>Recent Audit Trail:</h3>
      {auditLogs.map((log, i) => (
        <div key={i} style={{padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.03)',fontSize:'0.8rem'}}>
          [{new Date(log.time).toLocaleTimeString('id-ID')}] {log.user}: {log.action}
        </div>
      ))}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  )
}
