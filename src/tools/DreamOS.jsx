import { useState, useEffect } from 'react';

// Baca data dari localStorage Dream OS
function getDreamOSData() {
  try {
    const users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
    const auditLogs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
    const dana = JSON.parse(localStorage.getItem('dreamos_dana') || '[]');
    const k3 = JSON.parse(localStorage.getItem('dreamos_k3_reports') || '[]');
    const maint = JSON.parse(localStorage.getItem('dreamos_maintenance_tasks') || '[]');
    const bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
    const slide5 = localStorage.getItem('dreamos_slide_5') || 'N/A';
    const slide6 = localStorage.getItem('dreamos_slide_6') || 'N/A';
    const slide7 = localStorage.getItem('dreamos_slide_7') || 'N/A';
    const secToday = localStorage.getItem('dreamos_sec_today') || 'N/A';
    const executiveNote = localStorage.getItem('dreamos_executive_note') || 'N/A';
    
    return {
      totalUsers: users.length,
      users,
      recentAudit: auditLogs.slice(0, 10),
      totalDana: dana.length,
      pendingDana: dana.filter(d => d.status === 'pending').length,
      totalK3: k3.length,
      pendingK3: k3.filter(k => k.status === 'pending').length,
      totalMaint: maint.length,
      activeMaint: maint.filter(m => m.status !== 'Selesai' && m.status !== 'Disetujui').length,
      totalBookings: bookings.length,
      slides: { slide5, slide6, slide7 },
      secToday,
      executiveNote
    };
  } catch(e) {
    return null;
  }
}

export default function DreamOS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const dreamData = getDreamOSData();
      setData(dreamData);
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#00ff9d'}}>⏳ Loading Dream OS data...</div>;
  if (!data) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Tidak dapat membaca data Dream OS. Pastikan Anda login di Dream OS terlebih dahulu.</div>;

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'1.5rem'}}>
          <div style={{fontSize:'2rem'}}>🏢</div>
          <h1 style={{color:'#00ff9d',fontFamily:"'Orbitron',monospace",margin:0}}>DREAM OS MONITOR</h1>
          <span style={{background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.4)',borderRadius:'20px',padding:'0.3rem 0.8rem',fontSize:'0.7rem',color:'#10b981'}}>LIVE</span>
        </div>

        {/* Quick Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:'0.8rem',marginBottom:'1.5rem'}}>
          {[
            { icon:'👥', label:'Total Users', value:data.totalUsers, color:'#00ff9d' },
            { icon:'💰', label:'Dana Pending', value:data.pendingDana, color:'#f59e0b' },
            { icon:'⚠️', label:'K3 Pending', value:data.pendingK3, color:'#ef4444' },
            { icon:'🔧', label:'Maint Aktif', value:data.activeMaint, color:'#0ea5e9' },
            { icon:'📅', label:'Bookings', value:data.totalBookings, color:'#8b5cf6' },
            { icon:'📋', label:'Audit Logs', value:data.recentAudit.length, color:'#10b981' }
          ].map((stat, i) => (
            <div key={i} className="glass" style={{textAlign:'center',padding:'0.8rem'}}>
              <div style={{fontSize:'1.5rem',marginBottom:'0.3rem'}}>{stat.icon}</div>
              <div style={{fontSize:'1.3rem',fontWeight:700,color:stat.color,fontFamily:"'Orbitron',monospace"}}>{stat.value}</div>
              <div style={{fontSize:'0.6rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* User List */}
        <div className="glass" style={{marginBottom:'1rem'}}>
          <h3 style={{color:'#00ff9d',fontFamily:"'Orbitron',monospace",marginBottom:'0.8rem'}}>👥 DAFTAR USER</h3>
          <div style={{maxHeight:'200px',overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.75rem'}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                  <th style={{textAlign:'left',padding:'0.4rem',color:'#64748b'}}>Nama</th>
                  <th style={{textAlign:'left',padding:'0.4rem',color:'#64748b'}}>Email</th>
                  <th style={{textAlign:'left',padding:'0.4rem',color:'#64748b'}}>Role</th>
                  <th style={{textAlign:'left',padding:'0.4rem',color:'#64748b'}}>Device</th>
                </tr>
              </thead>
              <tbody>
                {data.users.slice(0, 20).map((u, i) => (
                  <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                    <td style={{padding:'0.4rem'}}>{u.nama || '-'}</td>
                    <td style={{padding:'0.4rem',fontSize:'0.65rem',color:'#94a3b8'}}>{u.email}</td>
                    <td style={{padding:'0.4rem'}}>
                      <span style={{background:u.role==='dev'?'rgba(139,92,246,0.2)':u.role==='kabag'?'rgba(245,158,11,0.2)':'rgba(14,165,233,0.2)',padding:'0.15rem 0.4rem',borderRadius:'4px',fontSize:'0.6rem',color:u.role==='dev'?'#8b5cf6':u.role==='kabag'?'#f59e0b':'#0ea5e9'}}>{u.role}</span>
                    </td>
                    <td style={{padding:'0.4rem'}}>{u.device_dna ? '🔒' : '⏳'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit & Slides */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
          <div className="glass">
            <h3 style={{color:'#00ff9d',fontFamily:"'Orbitron',monospace",marginBottom:'0.8rem'}}>📜 AUDIT TERAKHIR</h3>
            <div style={{maxHeight:'200px',overflowY:'auto'}}>
              {data.recentAudit.map((log, i) => (
                <div key={i} style={{padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.03)',fontSize:'0.7rem'}}>
                  <span style={{color:'#64748b'}}>[{new Date(log.time).toLocaleTimeString('id-ID')}]</span>{' '}
                  <span style={{color:'#0ea5e9'}}>{log.user}</span>: {log.action}
                </div>
              ))}
            </div>
          </div>
          <div className="glass">
            <h3 style={{color:'#00ff9d',fontFamily:"'Orbitron',monospace",marginBottom:'0.8rem'}}>📢 SLIDE DASHBOARD</h3>
            <div style={{fontSize:'0.75rem'}}>
              <p><strong style={{color:'#f59e0b'}}>Slide 5:</strong> {data.slides.slide5}</p>
              <p><strong style={{color:'#f59e0b'}}>Slide 6:</strong> {data.slides.slide6}</p>
              <p><strong style={{color:'#f59e0b'}}>Slide 7:</strong> {data.slides.slide7}</p>
              <p><strong style={{color:'#f59e0b'}}>Security:</strong> {data.secToday}</p>
              <p><strong style={{color:'#f59e0b'}}>Catatan Pimpinan:</strong> {data.executiveNote}</p>
            </div>
          </div>
        </div>

        <a href="/" style={{display:'block',textAlign:'center',marginTop:'1rem',color:'#0ea5e9'}}>← Kembali ke Dashboard</a>
      </div>
    </div>
  );
}
