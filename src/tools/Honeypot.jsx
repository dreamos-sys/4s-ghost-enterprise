export default function Honeypot() {
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🍯 Honeypot Trap</h1>
      <p>Active traps: <strong style={{color:'#f59e0b'}}>5</strong></p>
      <p>Attackers caught: <strong style={{color:'#ef4444'}}>23</strong></p>
      <p>Last trigger: <strong>10.0.0.45</strong> (2 min ago)</p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
