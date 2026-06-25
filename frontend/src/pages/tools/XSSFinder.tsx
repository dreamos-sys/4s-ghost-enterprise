import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { xssApi } from '../../services/api';
import toast from 'react-hot-toast';

interface XSSFinding {
  pattern: string;
  match: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  line: number;
}

interface ScanResults {
  totalFindings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  findings: XSSFinding[];
}

export default function XSSFinder() {
  const [mode, setMode] = useState<'content' | 'url'>('content');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const navigate = useNavigate();

  const handleScan = async () => {
    if (mode === 'content' && !content.trim()) {
      toast.error('Please enter content to scan');
      return;
    }
    if (mode === 'url' && !url.trim()) {
      toast.error('Please enter a URL to scan');
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      let response;
      if (mode === 'content') {
        response = await xssApi.scanContent(content);
      } else {
        response = await xssApi.scanURL(url);
      }
      
      setResults(response.data);
      
      if (response.data.totalFindings === 0) {
        toast.success('No XSS vulnerabilities found!');
      } else {
        toast.warning(`Found ${response.data.totalFindings} potential XSS vulnerabilities`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const loadExample = () => {
    const examples = {
      content: `<div onclick="alert('XSS')">Click me</div>
<script>alert('XSS')</script>
<a href="javascript:alert('XSS')">Link</a>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>`,
      url: 'https://example.com'
    };
    
    if (mode === 'content') {
      setContent(examples.content);
    } else {
      setUrl(examples.url);
    }
    toast.success('Example loaded');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900/30 border-red-600 text-red-400';
      case 'high': return 'bg-orange-900/30 border-orange-600 text-orange-400';
      case 'medium': return 'bg-yellow-900/30 border-yellow-600 text-yellow-400';
      case 'low': return 'bg-blue-900/30 border-blue-600 text-blue-400';
      default: return 'bg-slate-900/30 border-slate-600 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">💉 XSS Finder</h1>
              <p className="text-slate-400">Detect Cross-Site Scripting vulnerabilities</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('content')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'content'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
              }`}
            >
              📄 Scan Content
            </button>
            <button
              onClick={() => setMode('url')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'url'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
              }`}
            >
              🌐 Scan URL
            </button>
          </div>

          {mode === 'content' ? (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">HTML Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste HTML content here..."
                className="w-full h-64 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Target URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {isScanning ? '⏳ Scanning...' : '🔍 Scan for XSS'}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              📋 Load Example
            </button>
            <button
              onClick={() => { setContent(''); setUrl(''); setResults(null); }}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">📊 Scan Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-slate-400 text-xs mb-1">Total</div>
                  <div className="text-white text-2xl font-bold">{results.totalFindings}</div>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
                  <div className="text-red-400 text-xs mb-1">Critical</div>
                  <div className="text-red-400 text-2xl font-bold">{results.critical}</div>
                </div>
                <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 text-center">
                  <div className="text-orange-400 text-xs mb-1">High</div>
                  <div className="text-orange-400 text-2xl font-bold">{results.high}</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-center">
                  <div className="text-yellow-400 text-xs mb-1">Medium</div>
                  <div className="text-yellow-400 text-2xl font-bold">{results.medium}</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
                  <div className="text-blue-400 text-xs mb-1">Low</div>
                  <div className="text-blue-400 text-2xl font-bold">{results.low}</div>
                </div>
              </div>
            </div>

            {results.findings.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🔍 Detailed Findings</h2>
                <div className="space-y-3">
                  {results.findings.map((finding, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-lg">{finding.pattern}</div>
                          <div className="text-sm opacity-80">{finding.description}</div>
                        </div>
                        <div className="text-xs uppercase font-bold px-3 py-1 bg-black/30 rounded">
                          {finding.severity}
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-black/30 rounded font-mono text-xs break-all">
                        Line {finding.line}: {finding.match}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!results && !isScanning && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">💉</div>
            <h3 className="text-xl text-slate-300 mb-2">No Scan Results Yet</h3>
            <p className="text-slate-500">Enter HTML content or a URL, then click "Scan for XSS" to detect vulnerabilities</p>
          </div>
        )}
      </div>
    </div>
  );
}
