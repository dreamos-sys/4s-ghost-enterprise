import { useState } from 'react';

export default function ResponseEngine() {
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const blockIP = () => {
    setLoading(true);
    setTimeout(() => {
      const blocked = JSON.parse(localStorage.getItem('blocked_ips') || '[]');
      blocked.push({ ip: '0.0.0.0', time: new Date().toISOString(), reason: 'Manual block' });
      localStorage.setItem('blocked_ips', JSON.stringify(blocked));
      setAction('✅ IP berhasil diblokir!');
      setLoading(false);
    }, 1000);
  };

  const lockAccount = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('dreamos_session_active', 'false');
      setAction('✅ Semua sesi dikunci!');
      setLoading(false);
    }, 1000);
  };

  const clearCache = () => {
    localStorage.removeItem('dreamos_audit_logs');
    localStorage.removeItem('blocked_ips');
    setAction('✅ Cache dibersihkan!');
  };

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace',marginBottom:'1.5rem'}}>⚡ AUTOMATED RESPONSE</h1>
      <div className="glass" style={{marginBottom:'1rem',padding:'1rem'}}>
        <button onClick={blockIP} disabled={loading} className="action-button" style={{marginBottom:'0.5rem',width:'100%'}}>
          🚫 Block Suspicious IP
        </button>
        <button onClick={lockAccount} disabled={loading} className="action-button" style={{marginBottom:'0.5rem',width:'100%',background:'#ef4444'}}>
          🔒 Lock All Sessions
        </button>
        <button onClick={clearCache} className="action-button" style={{width:'100%',background:'#f59e0b'}}>
          🧹 Clear Security Cache
        </button>
      </div>
      {action && <div className="glass" style={{padding:'1rem',textAlign:'center',color:'#10b981'}}>{action}</div>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9',textAlign:'center'}}>← Dashboard</a>
    </div>
  );
}
