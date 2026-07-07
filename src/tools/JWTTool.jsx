import { useState } from 'react';
export default function JWTTool() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const decode = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT');
      const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      setDecoded(JSON.stringify(payload, null, 2));
    } catch(e) {
      setDecoded('❌ Invalid JWT token');
    }
  };
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🔐 JWT Decoder</h1>
      <textarea value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste JWT token here..." rows={4} style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid rgba(0,255,157,0.3)',borderRadius:'10px',color:'#00ff9d',fontSize:'0.9rem',marginBottom:'0.8rem',resize:'vertical'}} />
      <button onClick={decode} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'10px',fontWeight:700,cursor:'pointer'}}>🔓 Decode</button>
      {decoded && <pre style={{marginTop:'1rem',padding:'1rem',background:'rgba(0,0,0,0.4)',borderRadius:'10px',color:'#00ff9d',whiteSpace:'pre-wrap'}}>{decoded}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
