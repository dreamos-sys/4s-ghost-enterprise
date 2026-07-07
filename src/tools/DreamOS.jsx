import { useState, useEffect } from 'react';
import { getDreamOSStats } from '../services/dreamos-data';

export default function DreamOS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const stats = await getDreamOSStats();
      setData(stats);
      setLoading(false);
    }
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#00ff9d'}}>⏳ Connecting to Supabase...</div>;
  if (!data) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Gagal mengambil data.</div>;

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace',marginBottom:'1rem'}}>🏢 DREAM OS MONITOR</h1>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:'0.8rem',marginBottom:'1rem'}}>
        {[
          { icon:'👥', label:'Total Users', value:data.totalUsers, color:'#00ff9d' },
          { icon:'📋', label:'Audit Logs', value:data.totalAudit, color:'#0ea5e9' },
          { icon:'⚠️', label:'K3 Pending', value:data.pendingK3, color:'#ef4444' },
          { icon:'💰', label:'Dana Pending', value:data.pendingDana, color:'#f59e0b' }
        ].map((stat, i) => (
          <div key={i} className="glass" style={{textAlign:'center',padding:'0.8rem'}}>
            <div style={{fontSize:'1.5rem'}}>{stat.icon}</div>
            <div style={{fontSize:'1.3rem',fontWeight:700,color:stat.color,fontFamily:"'Orbitron',monospace"}}>{stat.value}</div>
            <div style={{fontSize:'0.6rem',color:'#64748b'}}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass" style={{marginBottom:'1rem',padding:'1rem'}}>
        <h3 style={{color:'#00ff9d',marginBottom:'0.5rem'}}>👥 USER LIST</h3>
        <div style={{maxHeight:'200px',overflowY:'auto',fontSize:'0.75rem'}}>
          {(data.users || []).map((u, i) => (
            <div key={i} style={{padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              {u.nama} - <span style={{color:'#0ea5e9'}}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass" style={{padding:'1rem'}}>
        <h3 style={{color:'#00ff9d',marginBottom:'0.5rem'}}>📜 RECENT AUDIT</h3>
        {(data.recentAudit || []).map((log, i) => (
          <div key={i} style={{padding:'0.2rem 0',fontSize:'0.7rem',color:'#94a3b8'}}>
            [{new Date(log.time).toLocaleTimeString('id-ID')}] {log.user}: {log.action}
          </div>
        ))}
      </div>

      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9',textAlign:'center'}}>← Dashboard</a>
    </div>
  );
}
