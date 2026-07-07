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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#00ff9d'}}>⏳ Connecting to Supabase...</div>;
  if (!data) return <div style={{background:'#020617',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#ef4444'}}>⚠️ Gagal mengambil data dari Supabase.</div>;

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace',marginBottom:'1rem'}}>🏢 DREAM OS MONITOR</h1>
      <div className="glass" style={{marginBottom:'1rem',padding:'1rem'}}>
        <h3 style={{color:'#00ff9d'}}>📊 STATISTIK</h3>
        <p>👥 Total Users: <strong style={{color:'#00ff9d'}}>{data.totalUsers}</strong></p>
        <p>📋 Audit Logs: <strong style={{color:'#0ea5e9'}}>{data.totalAudit}</strong></p>
        <p>⚠️ K3 Pending: <strong style={{color:'#ef4444'}}>{data.pendingK3}</strong></p>
        <p>💰 Dana Pending: <strong style={{color:'#f59e0b'}}>{data.pendingDana}</strong></p>
      </div>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9',textAlign:'center'}}>← Dashboard</a>
    </div>
  );
}
