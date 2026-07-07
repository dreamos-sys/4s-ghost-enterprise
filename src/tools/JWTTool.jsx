import { useState } from 'react';
export default function JWTTool() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const decode = () => {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      setDecoded(JSON.stringify(payload, null, 2));
    } catch(e) { setDecoded('Invalid JWT'); }
  };
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d'}}>🔐 JWT Decoder</h1>
      <textarea value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste JWT" rows={4} style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid #00ff9d',borderRadius:'8px',color:'#00ff9d',marginBottom:'0.8rem'}} />
      <button onClick={decode} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'8px',fontWeight:700}}>Decode</button>
      {decoded && <pre style={{marginTop:'1rem',padding:'1rem',background:'#000',borderRadius:'8px',color:'#00ff9d',whiteSpace:'pre-wrap'}}>{decoded}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
