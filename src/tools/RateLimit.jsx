export default function RateLimit() {
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>⚡ Rate Limiter</h1>
      <p>Current limit: <strong>100 req/min</strong></p>
      <p>Blocked IPs today: <strong style={{color:'#ef4444'}}>17</strong></p>
      <p>Status: <span style={{color:'#10b981'}}>ACTIVE</span></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
