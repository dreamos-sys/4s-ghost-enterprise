export default function Forensic() {
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🔍 Forensic Analysis</h1>
      <p>Last scan: <strong>2026-07-07 02:30 UTC</strong></p>
      <p>Files analyzed: <strong style={{color:'#0ea5e9'}}>15,832</strong></p>
      <p>Anomalies found: <strong style={{color:'#ef4444'}}>3</strong></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
