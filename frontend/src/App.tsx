import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JWTDecoder from './pages/tools/JWTDecoder';
import PortScanner from './pages/tools/PortScanner';
import XSSFinder from './pages/tools/XSSFinder';
import SQLiTester from './pages/tools/SQLiTester';
import Honeypot from './pages/tools/Honeypot';
import RateLimiter from './pages/tools/RateLimiter';
import BotDetector from './pages/tools/BotDetector';
import AIDefense from './pages/tools/AIDefense';
import WhoisLookup from './pages/tools/WhoisLookup';
import DNSRecon from './pages/tools/DNSRecon';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-cyan-400 text-xl">Loading...</div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => { checkAuth(); }, [checkAuth]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tools/jwt-decoder" element={<ProtectedRoute><JWTDecoder /></ProtectedRoute>} />
        <Route path="/tools/port-scanner" element={<ProtectedRoute><PortScanner /></ProtectedRoute>} />
        <Route path="/tools/xss-finder" element={<ProtectedRoute><XSSFinder /></ProtectedRoute>} />
        <Route path="/tools/dns-recon" element={<ProtectedRoute><DNSRecon /></ProtectedRoute>} />
        <Route path="/tools/whois-lookup" element={<ProtectedRoute><WhoisLookup /></ProtectedRoute>} />
        <Route path="/tools/ai-defense" element={<ProtectedRoute><AIDefense /></ProtectedRoute>} />
        <Route path="/tools/bot-detector" element={<ProtectedRoute><BotDetector /></ProtectedRoute>} />
        <Route path="/tools/rate-limiter" element={<ProtectedRoute><RateLimiter /></ProtectedRoute>} />
        <Route path="/tools/honeypot" element={<ProtectedRoute><Honeypot /></ProtectedRoute>} />
        <Route path="/tools/sqli-tester" element={<ProtectedRoute><SQLiTester /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
export default App;
