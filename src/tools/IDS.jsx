import { useState, useEffect } from 'react';
import { getDreamOSStats } from '../services/dreamos-data';

export default function IDS() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const analyze = () => {
    const data = getDreamOSStats();
    if (!data) return;
    setStats(data);
    const newAlerts = [];
    
    if (data.pendingK3 > 3) newAlerts.push({ level: 'HIGH', msg: '⚠️ Banyak laporan K3 pending!' });
    if (data.pendingDana > 5) newAlerts.push({ level: 'HIGH', msg: '💰 Banyak dana pending!' });
    if (data.securityEvents > 20) newAlerts.push({ level: 'MEDIUM', msg: '🔒 Aktivitas keamanan tinggi' });
    if (data.botDetections > 10) newAlerts.push({ level: 'MEDIUM', msg: '🤖 Bot detection meningkat' });
    if (data.activeMaint > 10) newAlerts.push({ level: 'LOW', msg: '🔧 Maintenance menumpuk' });
    if (newAlerts.length === 0) newAlerts.push({ level: 'SAFE', msg: '✅ Semua normal' });
    
    setAlerts(newAlerts);
  };

  useEffect(() => {
    analyze();
    const interval = setInterval(analyze, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace',marginBottom:'1rem'}}>🛡️ INTRUSION DETECTION SYSTEM</h1>
      <button onClick={analyze} className="action-button" style={{marginBottom:'1rem'}}>🔄 Scan Now</button>
      {alerts.map((a, i) => (
        <div key={i} className="glass" style={{
          marginBottom:'0.5rem',
          borderLeft: `4px solid ${a.level==='HIGH'?'#ef4444':a.level==='MEDIUM'?'#f59e0b':a.level==='LOW'?'#0ea5e9':'#10b981'}`
        }}>
          <strong style={{color: a.level==='HIGH'?'#ef4444':a.level==='MEDIUM'?'#f59e0b':a.level==='LOW'?'#0ea5e9':'#10b981'}}>
            [{a.level}]</strong> {a.msg}
        </div>
      ))}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
