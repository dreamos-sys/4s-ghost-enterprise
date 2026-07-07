import { useState, useEffect } from 'react'
export default function DreamOS() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const load = () => {
      try {
        const users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]')
        const auditLogs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]')
        setData({
          totalUsers: users.length,
          users: users.slice(0, 10),
          recentAudit: auditLogs.slice(0, 10),
          slide5: localStorage.getItem('dreamos_slide_5') || '-',
          slide6: localStorage.getItem('dreamos_slide_6') || '-',
          slide7: localStorage.getItem('dreamos_slide_7') || '-'
        })
      } catch(e) { setData(null) }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])
  
  if (!data) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Buka Dream OS dulu untuk mengisi data.</div>
  
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace',marginBottom:'1.5rem'}}>🏢 DREAM OS MONITOR</h1>
      <div className="glass" style={{marginBottom:'1rem',padding:'1rem'}}>
        <h3 style={{color:'#00ff9d',marginBottom:'0.5rem'}}>📊 STATISTIK</h3>
        <p>👥 Total Users: <strong style={{color:'#00ff9d'}}>{data.totalUsers}</strong></p>
        <p>📋 Audit Logs: <strong style={{color:'#0ea5e9'}}>{data.recentAudit.length}</strong></p>
      </div>
      <div className="glass" style={{marginBottom:'1rem',padding:'1rem'}}>
        <h3 style={{color:'#00ff9d',marginBottom:'0.5rem'}}>👥 USER TERDAFTAR</h3>
        {data.users.map((u, i) => (
          <div key={i} style={{padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.8rem'}}>
            {u.nama} - <span style={{color:'#0ea5e9'}}>{u.role}</span>
          </div>
        ))}
      </div>
      <div className="glass" style={{padding:'1rem'}}>
        <h3 style={{color:'#00ff9d',marginBottom:'0.5rem'}}>📢 SLIDE DASHBOARD</h3>
        <p style={{fontSize:'0.8rem'}}>Slide 5: {data.slide5}</p>
        <p style={{fontSize:'0.8rem'}}>Slide 6: {data.slide6}</p>
        <p style={{fontSize:'0.8rem'}}>Slide 7: {data.slide7}</p>
      </div>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9',textAlign:'center'}}>← Dashboard</a>
    </div>
  )
}
