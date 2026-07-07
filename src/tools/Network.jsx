import { useState } from 'react';
import { scanPort } from '../services/api';
export default function Network() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const scan = async () => {
    setLoading(true);
    setResult('⏳ Scanning...');
    const data = await scanPort(target);
    if (data.error) {
      setResult(`⚠️ ${data.error}\n\n📋 Default scan results:\n${data.ports.map(p => `Port ${p.port}: ${p.status.toUpperCase()}`).join('\n')}`);
    } else {
      setResult(`✅ Scan complete for ${data.target}:\n${data.ports.map(p => `Port ${p.port}: ${p.status.toUpperCase()}`).join('\n')}`);
    }
    setLoading(false);
  };
  
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🌐 Network Scanner</h1>
      <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="Enter IP/Domain" style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid rgba(0,255,157,0.3)',borderRadius:'10px',color:'#00ff9d',fontSize:'0.9rem',marginBottom:'0.8rem'}} />
      <button onClick={scan} disabled={loading} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'10px',fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>⚡ Scan</button>
      {result && <pre style={{marginTop:'1rem',padding:'1rem',background:'rgba(0,0,0,0.4)',borderRadius:'10px',color:'#00ff9d',whiteSpace:'pre-wrap'}}>{result}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
