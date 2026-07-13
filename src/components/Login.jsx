import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hackerLog, setHackerLog] = useState('INITIALIZING...');

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setHackerLog(showPassword ? 'ENCRYPTING_INPUT...' : 'DECRYPTING_VISUAL...');
    setTimeout(() => setHackerLog('SYSTEM_READY'), 800);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHackerLog('AUTHENTICATING...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setHackerLog('ACCESS_GRANTED...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (err) {
      setError('INVALID_CREDENTIALS');
      setHackerLog('ACCESS_DENIED...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          font-family: 'Courier New', monospace;
          padding: 20px;
        }
        .scanner-box {
          width: 100%;
          max-width: 400px;
          border: 1px solid #00ff9d33;
          background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
          padding: 2.5rem;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 255, 157, 0.05);
        }
        .scanner-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff9d, transparent);
          animation: scanner 3s linear infinite;
        }
        @keyframes scanner {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .logo-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo-shield {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          border: 2px solid #00ff9d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
        }
        .title {
          font-size: 1.5rem;
          color: #00ff9d;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
        }
        .subtitle {
          font-size: 0.7rem;
          color: #00ff9d88;
          letter-spacing: 3px;
          margin-top: 0.5rem;
        }
        .hacker-log {
          background: rgba(0, 255, 157, 0.05);
          border-left: 2px solid #00ff9d;
          padding: 0.8rem;
          margin-bottom: 2rem;
          font-size: 0.75rem;
          color: #00ff9d;
          font-family: 'Courier New', monospace;
          position: relative;
          overflow: hidden;
        }
        .hacker-log::after {
          content: '_';
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .input-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        .input-label {
          display: block;
          font-size: 0.7rem;
          color: #00ff9d88;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }
        .scanner-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #00ff9d44;
          color: #00ff9d;
          padding: 1rem 3rem 1rem 1rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .scanner-input:focus {
          border-color: #00ff9d;
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.15);
        }
        .scanner-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ff9d, transparent);
          animation: scanLine 2s linear infinite;
          pointer-events: none;
          opacity: 0.5;
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #00ff9d;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 5px;
          transition: all 0.2s;
          z-index: 10;
        }
        .toggle-btn:hover {
          text-shadow: 0 0 10px #00ff9d;
          transform: translateY(-50%) scale(1.1);
        }
        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.8rem;
          margin-bottom: 1.5rem;
          font-size: 0.75rem;
          text-align: center;
          border-radius: 4px;
        }
        .submit-btn {
          width: 100%;
          background: rgba(0, 255, 157, 0.1);
          border: 1px solid #00ff9d;
          color: #00ff9d;
          padding: 1rem;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 0.9rem;
          letter-spacing: 3px;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          background: #00ff9d;
          color: #000;
          box-shadow: 0 0 30px rgba(0, 255, 157, 0.4);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .footer-text {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.65rem;
          color: #00ff9d44;
          letter-spacing: 2px;
        }
      `}</style>

      <div className="scanner-box">
        <div className="logo-section">
          <div className="logo-shield">🛡️</div>
          <h1 className="title">4S GHOST</h1>
          <p className="subtitle">ENTERPRISE DEFENSE SYSTEM</p>
        </div>

        <div className="hacker-log">
          {hackerLog}
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">IDENTITY_ID (EMAIL)</label>
            <div className="scanner-input-wrapper" style={{position: 'relative'}}>
              <input
                type="email"
                className="scanner-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamos.dev"
                required
                autoComplete="off"
              />
              <div className="scanner-line"></div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">ACCESS_KEY (PASSWORD)</label>
            <div className="scanner-input-wrapper" style={{position: 'relative'}}>
              <input
                type={showPassword ? "text" : "password"}
                className="scanner-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="off"
              />
              <div className="scanner-line"></div>
              <button 
                type="button" 
                className="toggle-btn" 
                onClick={togglePassword}
                title={showPassword ? "HIDE" : "SHOW"}
              >
                {showPassword ? "" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'AUTHENTICATING...' : '⚡ INITIATE ACCESS'}
          </button>
        </form>

        <div className="footer-text">
          🔒 INTERNAL USE ONLY • FAMILY DREAM TEAM
        </div>
      </div>
    </div>
  );
}
