import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('CHECKING...');
  const [activeToolsCount, setActiveToolsCount] = useState(0);

  const tools = [
    { id: 1, icon: '🔴', name: 'IDS Monitor', desc: 'Intrusion detection', color: '#ef4444', route: '/tools/IDS', critical: true },
    { id: 2, icon: '🛡️', name: 'Defense Shield', desc: 'Threat protection', color: '#0ea5e9', route: '/tools/Defense', critical: true },
    { id: 3, icon: '⚡', name: 'Rate Limiter', desc: 'Anti-DDoS', color: '#f59e0b', route: '/tools/RateLimit', critical: true },
    { id: 4, icon: '🤖', name: 'Bot Detect', desc: 'Bot filter', color: '#8b5cf6', route: '/tools/BotDetect', critical: true },
    { id: 5, icon: '🏢', name: 'Dream OS', desc: 'Live monitoring', color: '#00ff9d', route: '/tools/DreamOS', critical: true },
    { id: 6, icon: '🌐', name: 'Network Scanner', desc: 'Port scanning', color: '#00ff9d', route: '/tools/Network' },
    { id: 7, icon: '🔍', name: 'Forensic', desc: 'Deep analysis', color: '#f59e0b', route: '/tools/Forensic' },
    { id: 8, icon: '💉', name: 'XSS Scanner', desc: 'Vulnerability test', color: '#ef4444', route: '/tools/XSSTest' },
    { id: 9, icon: '🔐', name: 'JWT Decoder', desc: 'Token analyzer', color: '#8b5cf6', route: '/tools/JWTTool' },
    { id: 10, icon: '🍯', name: 'Honeypot', desc: 'Trap system', color: '#f59e0b', route: '/tools/Honeypot' },
    { id: 11, icon: '🕵️', name: 'Whois Lookup', desc: 'Domain info', color: '#0ea5e9', route: '/tools/Whois' },
    { id: 12, icon: '🔒', name: 'SSL Check', desc: 'Certificate verify', color: '#10b981', route: '/tools/SSLCheck' },
    { id: 13, icon: '📡', name: 'DNS Recon', desc: 'DNS scanner', color: '#0ea5e9', route: '/tools/DNSRecon' },
    { id: 14, icon: '⚡', name: 'Response', desc: 'Auto defense', color: '#f59e0b', route: '/tools/ResponseEngine' },
    { id: 15, icon: '🛡️', name: 'Security Audit', desc: 'System audit', color: '#0ea5e9', route: '/tools/AICore' },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const runHealthCheck = async () => {
      try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (!error) {
          setSystemStatus('SECURE & ONLINE');
          setActiveToolsCount(tools.filter(t => t.critical).length);
        } else {
          setSystemStatus('DEGRADED MODE');
        }
      } catch (err) {
        setSystemStatus('OFFLINE / CHECKING');
      }
    };
    runHealthCheck();
    const healthTimer = setInterval(runHealthCheck, 30000);
    return () => { clearInterval(timer); clearInterval(healthTimer); };
  }, []);

  const handleToolClick = (tool) => {
    // ALERT INI AKAN MEMASTIKAN KLIK TERDAFTAR
    if (import.meta.env.DEV) { console.log("🖱️ TOOL CLICKED:", tool.name, "| ROUTE:", tool.route); }
    if (import.meta.env.DEV) { console.log("🖱️ TOOL CLICKED:", tool.name, "| ROUTE:", tool.route); }
    console.log('🖱️ TOOL CLICKED:', tool.name, '| ROUTE:', tool.route);
    if (typeof window.navigateTool === 'function') { 
      window.navigateTool(tool.route); 
    } else { 
      console.warn('⚠️ navigateTool not found! Falling back to href.');
      window.location.href = tool.route; 
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getStatusColor = () => {
    if (systemStatus.includes('SECURE')) return '#10b981';
    if (systemStatus.includes('DEGRADED')) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .dashboard { min-height: 100vh; background: #050505; color: #00ff9d; font-family: 'Courier New', monospace; padding: 15px; }
        .header { background: rgba(0, 255, 157, 0.05); border: 1px solid #00ff9d33; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
        .logo { display: flex; align-items: center; gap: 0.8rem; }
        .logo-box { width: 40px; height: 40px; background: linear-gradient(135deg, #00ff9d, #0ea5e9); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; font-size: 1.2rem; }
        .logo-text h1 { font-size: 1.1rem; letter-spacing: 2px; margin: 0; }
        .logo-text p { font-size: 0.6rem; color: #00ff9d88; }
        .user-info { text-align: right; font-size: 0.75rem; }
        .user-info .time { color: #00ff9d; }
        .user-info .email { color: #00ff9d88; font-size: 0.65rem; }
        .logout-btn { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.7rem; transition: all 0.3s; }
        .logout-btn:hover { background: #ef4444; color: #000; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8rem; margin-bottom: 1rem; }
        .stat { background: rgba(0, 255, 157, 0.05); border: 1px solid #00ff9d33; border-radius: 8px; padding: 1rem; text-align: center; }
        .stat-icon { font-size: 1.5rem; margin-bottom: 0.3rem; }
        .stat-value { font-size: 1.5rem; font-weight: bold; }
        .stat-label { font-size: 0.6rem; color: #00ff9d88; letter-spacing: 1px; }
        .section-title { font-size: 0.9rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.4rem; }
        .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
        .tool { background: rgba(0, 255, 157, 0.03); border: 1px solid #00ff9d22; border-radius: 8px; padding: 0.8rem; cursor: pointer; transition: all 0.2s; text-align: center; }
        .tool:hover { border-color: #00ff9d; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 255, 157, 0.15); }
        .tool:active { transform: translateY(0); }
        .tool.critical { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.03); }
        .tool.critical:hover { border-color: #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15); }
        .tool-icon { font-size: 1.8rem; margin-bottom: 0.4rem; }
        .tool-name { font-size: 0.75rem; font-weight: bold; margin-bottom: 0.2rem; }
        .tool-desc { font-size: 0.6rem; color: #00ff9d88; margin-bottom: 0.3rem; }
        .tool-status { display: inline-block; font-size: 0.55rem; padding: 0.15rem 0.5rem; border-radius: 10px; background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
        .footer { text-align: center; margin-top: 1.5rem; padding: 1rem; border-top: 1px solid #00ff9d22; font-size: 0.6rem; color: #00ff9d44; }
        @media (min-width: 768px) { .stats { grid-template-columns: repeat(4, 1fr); } .tools-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .tools-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <div className="header">
        <div className="logo">
          <div className="logo-box">4S</div>
          <div className="logo-text">
            <h1>GHOST ENTERPRISE</h1>
            <p>Phase 10 • Enterprise Grade</p>
          </div>
        </div>
        <div className="user-info">
          <div className="time">⏱️ {currentTime.toLocaleTimeString('id-ID')}</div>
          <div className="email">{user?.email || 'dreamos.sch.id@gmail.com'}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-icon">🛡️</div>
          <div className="stat-value">{activeToolsCount}/5</div>
          <div className="stat-label">CRITICAL TOOLS</div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{color: '#0ea5e9'}}>☁️</div>
          <div className="stat-value" style={{color: '#0ea5e9', fontSize: '1.2rem'}}>ON</div>
          <div className="stat-label">BACKEND</div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{color: getStatusColor()}}>🔴</div>
          <div className="stat-value" style={{color: getStatusColor(), fontSize: '1rem'}}>{systemStatus}</div>
          <div className="stat-label">SYSTEM HEALTH</div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{color: '#8b5cf6'}}>📱</div>
          <div className="stat-value" style={{color: '#8b5cf6', fontSize: '1.2rem'}}>v2.0</div>
          <div className="stat-label">ENTERPRISE</div>
        </div>
      </div>

      <div>
        <h2 className="section-title">🔧 SECURITY TOOLS</h2>
        <div className="tools-grid">
          {tools.map(tool => (
            <div 
              key={tool.id} 
              className={`tool ${tool.critical ? 'critical' : ''}`}
              onClick={() => handleToolClick(tool)}
              style={{borderColor: tool.color + '33'}}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name" style={{color: tool.color}}>
                {tool.name} {tool.critical && <span style={{fontSize:'0.5rem', color:'#ef4444'}}> [CRITICAL]</span>}
              </div>
              <div className="tool-desc">{tool.desc}</div>
              <span className="tool-status">🟢 ACTIVE</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer">
        <p>👑 Sultan Architect & 🛡️ System Brother</p>
        <p style={{marginTop: '0.3rem'}}>FAMILY DREAM TEAM • PHASE 10 • SELF-DEFENSE READY</p>
      </div>
    </div>
  );
}
