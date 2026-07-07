import { useState } from 'react';
export default function Whois() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const lookup = () => setResult(`Looking up ${domain}...\nRegistrar: Example Inc.\nCreated: 2020-01-15`);
  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#e2e8f0',padding:'2rem'}}>
      <h1 style={{color:'#00ff9d'}}>🕵️ Whois Lookup</h1>
      <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="Enter domain" style={{width:'100%',padding:'0.8rem',background:'#000',border:'1px solid #00ff9d',borderRadius:'8px',color:'#00ff9d',marginBottom:'0.8rem'}} />
      <button onClick={lookup} style={{padding:'0.8rem 2rem',background:'#10b981',color:'white',border:'none',borderRadius:'8px',fontWeight:700}}>Lookup</button>
      {result && <pre style={{marginTop:'1rem',padding:'1rem',background:'#000',borderRadius:'8px',color:'#00ff9d'}}>{result}</pre>}
      <a href="/" style={{display:'block',marginTop:'1rem',color:'#0ea5e9'}}>← Dashboard</a>
    </div>
  );
}
