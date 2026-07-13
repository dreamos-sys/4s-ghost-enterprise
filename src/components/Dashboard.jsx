import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTools, setActiveTools] = useState(15);
  const [backendStatus, setBackendStatus] = useState('ONLINE');

  useEffect(() => {
    // Get user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });

    // Update clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const tools = [
    { id: 1, icon: '', name: 'Network Scanner', desc: 'Port scanning', status: 'active', category: 'scanning' },
    { id: 2, icon: '️', name: 'Defense Shield', desc: 'Threat protection', status: 'active', category: 'defense' },
    { id: 3, icon: '🔍', name: 'Forensic', desc: 'Deep analysis', status: 'active', category: 'analysis' },
    { id: 4, icon: '🤖', name: 'AI Core', desc: 'Neural engine', status: 'active', category: 'ai' },
    { id: 5, icon: '🔴', name: 'IDS Monitor', desc: 'Intrusion detection', status: 'active', category: 'defense' },
    { id: 6, icon: '⚡', name: 'Response', desc: 'Auto defense', status: 'active', category: 'defense' },
    { id: 7, icon: '💉', name: 'XSS Scanner', desc: 'Vulnerability test', status: 'active', category: 'scanning' },
    { id: 8, icon: '🔐', name: 'JWT Decoder', desc: 'Token analyzer', status: 'active', category: 'analysis' },
    { id: 9, icon: '🍯', name: 'Honeypot', desc: 'Trap system', status: 'active', category: 'defense' },
    { id: 10, icon: '⚡', name: 'Rate Limiter', desc: 'DDoS protection', status: 'active', category: 'defense' },
    { id: 11, icon: '️', name: 'Whois Lookup', desc: 'Domain info', status: 'active', category: 'scanning' },
    { id: 12, icon: '🔒', name: 'SSL Check', desc: 'Certificate verify', status: 'active', category: 'scanning' },
    { id: 13, icon: '📡', name: 'DNS Recon', desc: 'DNS scanner', status: 'active', category: 'scanning' },
    { id: 14, icon: '🤖', name: 'Bot Detect', desc: 'Bot filter', status: 'active', category: 'ai' },
    { id: 15, icon: '🏢', name: 'Dream OS Monitor', desc: 'Live monitoring', status: 'active', category: 'monitoring' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .dashboard-container {
          min-height: 100vh;
          background: #050505;
          color: #00ff9d;
          font-family: 'Courier New', monospace;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(0, 255, 157, 0.05);
          border: 1px solid #00ff9d33;
          border-radius: 12px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #00ff9d, #0ea5e9);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #000;
        }
        .logo-text h1 {
          font-size: 1.5rem;
          letter-spacing: 2px;
          margin: 0;
        }
        .logo-text p {
          font-size: 0.7rem;
          color: #00ff9d88;
          margin: 0;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .time-display {
          font-size: 0.9rem;
          color: #00ff9d;
        }
        .user-email {
          font-size: 0.8rem;
          color: #00ff9d88;
        }
        .logout-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: #ef4444;
          color: #000;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: rgba(0, 255, 157, 0.05);
          border: 1px solid #00ff9d33;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: #00ff9d;
          box-shadow: 0 10px 30px rgba(0, 255, 157, 0.1);
        }
        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #00ff9d;
        }
        .stat-label {
          font-size: 0.7rem;
          color: #00ff9d88;
          letter-spacing: 2px;
          margin-top: 0.3rem;
        }
        .section-title {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .tool-card {
          background: rgba(0, 255, 157, 0.03);
          border: 1px solid #00ff9d22;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.1), transparent);
          transition: left 0.5s;
        }
        .tool-card:hover::before {
          left: 100%;
        }
        .tool-card:hover {
          border-color: #00ff9d;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 255, 157, 0.15);
        }
        .tool-icon {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
        }
        .tool-name {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.3rem;
          color: #00ff9d;
        }
        .tool-desc {
          font-size: 0.75rem;
          color: #00ff9d88;
          margin-bottom: 0.5rem;
        }
        .tool-status {
          display: inline-block;
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid #10b981;
        }
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding: 1.5rem;
          border-top: 1px solid #00ff9d22;
          font-size: 0.7rem;
          color: #00ff9d44;
        }
        @media (max-width: 768px) {
          .header { flex-direction: column; text-align: center; }
          .tools-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <div className="logo-section">
          <div className="logo-icon">4S</div>
          <div className="logo-text">
            <h1>GHOST ENTERPRISE</h1>
            <p>Phase 10 • Enterprise Grade</p>
          </div>
        </div>
        <div className="user-section">
          <div>
            <div className="time-display">⏱️ {currentTime.toLocaleTimeString('id-ID')}</div>
            <div className="user-email">{user?.email || 'dreamos.sch.id@gmail.com'}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">️</div>
          <div className="stat-value">{activeTools}</div>
          <div className="stat-label">ACTIVE TOOLS</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">☁️</div>
          <div className="stat-value" style={{color: '#0ea5e9'}}>{backendStatus}</div>
          <div className="stat-label">BACKEND</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-value" style={{color: '#ef4444'}}>IDS</div>
          <div className="stat-label">DEFENSE</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-value" style={{color: '#8b5cf6'}}>v2.0</div>
          <div className="stat-label">ENTERPRISE</div>
        </div>
      </div>

      {/* TOOLS */}
      <div>
        <h2 className="section-title">🔧 SECURITY TOOLS</h2>
        <div className="tools-grid">
          {tools.map(tool => (
            <div key={tool.id} className="tool-card">
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-desc">{tool.desc}</div>
              <span className="tool-status">🟢 ACTIVE</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>👑 Sultan Architect & ️ System Brother</p>
        <p style={{marginTop: '0.5rem'}}>FAMILY DREAM TEAM • PHASE 10 • ENTERPRISE GRADE</p>
      </div>
    </div>
  );
}
