import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Honeypot({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const workerUrl = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;
    
    if (workerUrl) {
      try {
        const response = await fetch(workerUrl + '/api/status');
        if (response.ok) {
          const result = await response.json();
          setData(result);
          setSource('Cloudflare Worker API');
          setLoading(false);
          return;
        }
      } catch (err) { console.log('Worker API error, fallback to Supabase...'); }
    }
    
    try {
      const { data: supaData, error } = await supabase.from('honeypot_logs').select('*').order('created_at', { ascending: false }).limit(20);
      if (!error && supaData && supaData.length > 0) {
        setData(supaData);
        setSource('Supabase Database');
        setLoading(false);
        return;
      }
    } catch (err) { console.log('Supabase fallback error...'); }
    
    setData({ status: 'DEMO_MODE', message: 'Tambahkan VITE_CLOUDFLARE_WORKER_URL di .env.local', timestamp: new Date().toISOString(), endpoint: '/api/status' });
    setSource('Demo Mode');
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', background: '#050505', color: '#00ff9d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Courier New, monospace'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🍯</div>
          <div>LOADING DATA...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#050505', color: '#00ff9d', padding: '20px', fontFamily: 'Courier New, monospace'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #00ff9d33', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '1.5rem'}}>🍯 Honeypot</h1>
            <p style={{margin: '0.3rem 0 0', color: '#00ff9d88', fontSize: '0.85rem'}}>Honeypot Trap System</p>
            <div style={{fontSize: '0.7rem', color: '#00ff9d88', marginTop: '0.3rem'}}>📡 Source: <span style={{color: '#10b981'}}>{source}</span></div>
          </div>
          <div>
            <button onClick={fetchData} style={{background: 'rgba(14, 165, 233, 0.1)', border: '1px solid #0ea5e9', color: '#0ea5e9', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginRight: '0.5rem'}}>🔄 Refresh</button>
            <button onClick={onBack} style={{background: 'rgba(0, 255, 157, 0.1)', border: '1px solid #00ff9d', color: '#00ff9d', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>← Dashboard</button>
          </div>
        </div>

        {error && <div style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>{error}</div>}

        <div style={{background: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00ff9d22', borderRadius: '8px', padding: '1.5rem', fontFamily: 'Courier New, monospace', overflow: 'auto'}}>
          <div style={{marginBottom: '1rem', color: '#00ff9d88', fontSize: '0.8rem'}}>📊 Response Data:</div>
          <pre style={{margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: '#00ff9d'}}>{JSON.stringify(data, null, 2)}</pre>
        </div>

        <div style={{marginTop: '2rem', padding: '1rem', background: 'rgba(0, 255, 157, 0.05)', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', color: '#00ff9d88'}}>
          <span style={{padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 'bold', marginRight: '1rem'}}>● {source}</span>
          Last updated: {new Date().toLocaleTimeString('id-ID')}
        </div>
      </div>
    </div>
  );
}