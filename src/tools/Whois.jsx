import { useState } from 'react';
import { whoisLookup } from '../services/api';
export default function Whois() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const lookup = async () => {
    setLoading(true);
    setResult('⏳ Looking up...');
    const data = await whoisLookup(domain);
    if (data.error) {
      setResult(`⚠️ ${data.error}\n\n📋 Cached result:\nRegistrar: ${data.registrar}\nCreated: ${data.created}`);
    } else {
      setResult(`✅ Whois for ${data.domain}:\nRegistrar: ${data.registrar}\nCreated: ${data.created}\nExpires: ${data.expires}\nName Servers: ${(data.nameServers||[]).join(', ')}`);
    }
    setLoading(false);
  };
  
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>🕵️ Whois Lookup</h1>
      <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="Enter domain" style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid rgba(0,255,157,0.3)',borderRadius:'10px',color:'#00ff9d',fontSize:'0.9rem',marginBottom:'0.8rem'}} />
      <button onClick={lookup} disabled={loading} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'10px',fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>🔍 Lookup</button>
      {result && <pre style={{marginTop:'1rem',padding:'1rem',background:'rgba(0,0,0,0.4)',borderRadius:'10px',color:'#00ff9d',whiteSpace:'pre-wrap'}}>{result}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
