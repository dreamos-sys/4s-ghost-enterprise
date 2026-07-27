import { useState } from 'react';

const WORKER_BASE = 'https://4s-ghost-api.afumum234.workers.dev';

export default function Whois({ onBack }) {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${WORKER_BASE}/api/whois?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#00ff9d',fontFamily:'monospace',padding:15}}>
      <button onClick={onBack} style={{background:'transparent',color:'#00ff9d',border:'1px solid #00ff9d',padding:'5px 10px',marginBottom:10}}>← BACK</button>
      <h2>🕵️ WHOIS LOOKUP</h2>
      <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com"
        style={{background:'#111',color:'#00ff9d',border:'1px solid #00ff9d',padding:8,width:'100%',marginBottom:10}} />
      <button onClick={handleLookup} disabled={loading}
        style={{background:'#00ff9d',color:'#000',border:'none',padding:'8px 20px',fontWeight:'bold',cursor:'pointer'}}>
        {loading ? 'Scanning...' : 'LOOKUP'}
      </button>
      {error && (
        <div style={{background:'rgba(255,0,0,0.2)',padding:10,marginTop:10,border:'1px solid red',borderRadius:4}}>
          ⚠️ Error: {error}
        </div>
      )}
      {result && (
        <pre style={{background:'#111',padding:10,marginTop:10,border:'1px solid #00ff9d33',overflowX:'auto',fontSize:12}}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
