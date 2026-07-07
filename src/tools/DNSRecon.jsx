import { useState } from 'react';
export default function DNSRecon() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const scan = () => {
    setResult(`🔍 DNS scan for ${domain}...\n\nA: 185.199.108.153\nMX: mail.example.com\nTXT: v=spf1 include:_spf.google.com ~all\nNS: ns1.dreamhost.com`);
  };
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem',fontFamily:'Inter,sans-serif'}}>
      <h1 style={{color:'#00ff9d',fontFamily:'Orbitron,monospace'}}>📡 DNS Recon</h1>
      <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="Enter domain" style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid rgba(0,255,157,0.3)',borderRadius:'10px',color:'#00ff9d',fontSize:'0.9rem',marginBottom:'0.8rem'}} />
      <button onClick={scan} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'10px',fontWeight:700,cursor:'pointer'}}>🔍 Scan</button>
      {result && <pre style={{marginTop:'1rem',padding:'1rem',background:'rgba(0,0,0,0.4)',borderRadius:'10px',color:'#00ff9d'}}>{result}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
