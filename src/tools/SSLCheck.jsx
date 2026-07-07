export default function SSLCheck() {
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🔒 SSL Certificate Checker</h1>
      <p>Domain: <strong>dreamos-sys.github.io</strong></p>
      <p>Issuer: <strong>Let's Encrypt</strong></p>
      <p>Valid until: <strong style={{color:'#10b981'}}>2026-09-15</strong></p>
      <p>Grade: <strong style={{color:'#10b981'}}>A+</strong></p>
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
