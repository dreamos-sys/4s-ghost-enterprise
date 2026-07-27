console.log("✅ App.jsx loaded"); window.navigateTool = window.navigateTool || null;
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './lib/supabase';

console.log('✅ App.jsx loaded');

// Import semua tool (tetap seperti sebelumnya)
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

  // Fungsi navigasi global tanpa popstate (stabil)
  window.navigateTool = (route) => {
    setCurrentRoute(route);
    // Tidak perlu pushState agar tidak memicu popstate
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff9d', fontFamily: 'Courier New, monospace' }}>
        ⏳ Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const ToolComponent = toolComponents[currentRoute];

  if (ToolComponent) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505' }}>
        <ToolComponent onBack={() => setCurrentRoute('/')} />
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
