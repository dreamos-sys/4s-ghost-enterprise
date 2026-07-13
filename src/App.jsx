import { useState } from 'react';
import Dashboard from './components/Dashboard';

// Import tools (Pastikan nama file sesuai dengan yang ada di folder src/tools/)
// Jika ada yang error "Module not found", hapus baris import-nya sementara
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

  // Fungsi ini akan dipanggil oleh Dashboard saat tool diklik
  window.navigateTool = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  // Handle browser back/forward button
  window.addEventListener('popstate', () => {
    setCurrentRoute(window.location.pathname);
  });

  const ToolComponent = toolComponents[currentRoute];

  if (ToolComponent) {
    return <ToolComponent onBack={() => window.navigateTool('/')} />;
  }

  return <Dashboard />;
}

export default App;
