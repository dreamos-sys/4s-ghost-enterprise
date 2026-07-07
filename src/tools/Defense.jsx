export default function Defense() {
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🛡️ Defense Shield</h1>
      <p>Threats blocked: <strong style={{color:'#10b981'}}>1,247</strong></p>
      <p>Firewall: <span style={{color:'#10b981'}}>ACTIVE</span></p>
      <p>Last attack: <span style={{color:'#f59e0b'}}>3 minutes ago (SQLi attempt)</span></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
