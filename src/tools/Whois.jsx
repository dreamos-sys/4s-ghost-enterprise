import { useState } from 'react';
import { fetchWhois } from '../services/api';

export default function Whois({ onBack }) {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setLoading(true);
    const data = await fetchWhois(domain);
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#00ff9d',fontFamily:'monospace',padding:15}}>
      <button onClick={onBack} style={{background:'transparent',color:'#00ff9d',border:'1px solid #00ff9d',padding:'5px 10px',marginBottom:10}}>← BACK</button>
      <h2>🕵️ WHOIS LOOKUP</h2>
      <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com"
        style={{background:'#111',color:'#00ff9d',border:'1px solid #00ff9d',padding:8,width:'100%',marginBottom:10}} />
      <button onClick={handleLookup} disabled={loading}
        style={{background:'#00ff9d',color:'#000',border:'none',padding:'8px 20px',fontWeight:'bold'}}>
        {loading ? 'Scanning...' : 'LOOKUP'}
      </button>
      {result && (
        <pre style={{background:'#111',padding:10,marginTop:10,border:'1px solid #00ff9d33',overflowX:'auto'}}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
