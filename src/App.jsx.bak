import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './lib/supabase';

// Import tools
import IDS from './tools/IDS.jsx';
import Defense from './tools/Defense.jsx';
import RateLimit from './tools/RateLimit.jsx';
import BotDetect from './tools/BotDetect.jsx';
import DreamOS from './tools/DreamOS.jsx';
import Network from './tools/Network.jsx';
import Forensic from './tools/Forensic.jsx';
import XSSTest from './tools/XSSTest.jsx';
import JWTTool from './tools/JWTTool.jsx';
import Honeypot from './tools/Honeypot.jsx';
import Whois from './tools/Whois.jsx';
import SSLCheck from './tools/SSLCheck.jsx';
import DNSRecon from './tools/DNSRecon.jsx';
import ResponseEngine from './tools/ResponseEngine.jsx';
import AICore from './tools/AICore.jsx';

const toolComponents = {
  '/tools/IDS': IDS,
  '/tools/Defense': Defense,
  '/tools/RateLimit': RateLimit,
  '/tools/BotDetect': BotDetect,
  '/tools/DreamOS': DreamOS,
  '/tools/Network': Network,
  '/tools/Forensic': Forensic,
  '/tools/XSSTest': XSSTest,
  '/tools/JWTTool': JWTTool,
  '/tools/Honeypot': Honeypot,
  '/tools/Whois': Whois,
  '/tools/SSLCheck': SSLCheck,
  '/tools/DNSRecon': DNSRecon,
  '/tools/ResponseEngine': ResponseEngine,
  '/tools/AICore': AICore,
};

function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  window.navigateTool = (route) => {
    setIsTransitioning(true);
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    // Hilangkan transitioning setelah render selesai
    setTimeout(() => setIsTransitioning(false), 100);
  };

  window.addEventListener('popstate', () => {
    setIsTransitioning(true);
    setCurrentRoute(window.location.pathname);
    setTimeout(() => setIsTransitioning(false), 100);
  });

  // Loading screen dengan background gelap
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#00ff9d', 
        fontFamily: 'Courier New, monospace',
        fontSize: '0.9rem'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '1rem'}}>️</div>
          <div>INITIALIZING SYSTEM SECURITY...</div>
          <div style={{fontSize: '0.7rem', color: '#00ff9d88', marginTop: '0.5rem'}}>Loading modules</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const ToolComponent = toolComponents[currentRoute];

  if (ToolComponent) {
    return (
      <div style={{
        animation: isTransitioning ? 'fadeIn 0.3s ease' : 'none',
        minHeight: '100vh',
        background: '#050505'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <ToolComponent onBack={() => window.navigateTool('/')} />
      </div>
    );
  }

  return (
    <div style={{
      animation: 'fadeIn 0.3s ease',
      minHeight: '100vh',
      background: '#050505'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <Dashboard />
    </div>
  );
}

export default App;
