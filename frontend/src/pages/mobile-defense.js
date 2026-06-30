import { useState, useEffect } from 'react';

export default function MobileDefense() {
  const [data, setData] = useState({
    securityScore: 100,
    threats: [],
    towerId: '--',
    signalStrength: 0
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/mobile/report/latest');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background:'#050505', color:'#c0c0c0', fontFamily:'monospace', minHeight:'100vh', padding:20 }}>
      <h1 style={{ color:'#00f0ff', textAlign:'center' }}>📡 MOBILE DEFENSE ENTERPRISE</h1>
      
      <div style={{ background:'rgba(10,10,10,0.9)', border:'1px solid rgba(0,240,255,0.2)', padding:20, borderRadius:8, marginBottom:15 }}>
        <div style={{ fontSize:'3rem', fontWeight:'bold', textAlign:'center' }}>{data.securityScore}</div>
        <div style={{ textAlign:'center' }}>Security Score</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:15 }}>
        <div style={{ background:'rgba(10,10,10,0.9)', border:'1px solid rgba(0,240,255,0.2)', padding:20, borderRadius:8 }}>
          <div style={{ fontSize:'1.5rem', textAlign:'center' }}>{data.signalStrength} dBm</div>
          <div style={{ textAlign:'center' }}>Signal</div>
        </div>
        <div style={{ background:'rgba(10,10,10,0.9)', border:'1px solid rgba(0,240,255,0.2)', padding:20, borderRadius:8 }}>
          <div style={{ fontSize:'0.9rem', textAlign:'center' }}>{data.towerId}</div>
          <div style={{ textAlign:'center' }}>Tower</div>
        </div>
      </div>

      <div style={{ background:'rgba(10,10,10,0.9)', border:'1px solid rgba(0,240,255,0.2)', padding:20, borderRadius:8 }}>
        <h3 style={{ color:'#ffaa00' }}>⚠️ Threats</h3>
        {data.threats.length === 0 ? (
          <p style={{ color:'#00ff41' }}>✅ No threats detected</p>
        ) : (
          data.threats.map((t, i) => (
            <div key={i} style={{ background:'rgba(255,0,60,0.1)', border:'1px solid #ff003c', padding:10, margin:'5px 0', borderRadius:5 }}>
              <strong>{t.type}</strong> ({t.severity})<br/>
              {t.message}<br/>
              <small>{t.timestamp}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
