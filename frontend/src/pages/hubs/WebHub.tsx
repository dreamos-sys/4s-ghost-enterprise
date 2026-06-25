import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'robots' | 'sitemap' | 'meta' | 'og' | 'twitter' | 'favicon' | 'redirect' | 'tech' | 'broken' | 'pagespeed';

export default function WebHub() {
  const [activeTool, setActiveTool] = useState<Tool>('meta');
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'meta', name: 'Meta Tags', icon: '🏷️' },
    { id: 'og', name: 'OpenGraph', icon: '📘' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'robots', name: 'Robots.txt', icon: '🤖' },
    { id: 'sitemap', name: 'Sitemap', icon: '🗺️' },
    { id: 'favicon', name: 'Favicon', icon: '⭐' },
    { id: 'redirect', name: 'Redirects', icon: '↪️' },
    { id: 'tech', name: 'Tech Stack', icon: '🔧' },
    { id: 'broken', name: 'Broken Links', icon: '🔗' },
    { id: 'pagespeed', name: 'PageSpeed', icon: '⚡' },
  ];

  const analyze = async () => {
    if (!url) { toast.error('Enter URL'); return; }
    let result = '';
    try {
      if (activeTool === 'robots') {
        const res = await fetch(url.replace(/\/$/, '') + '/robots.txt');
        result = await res.text();
      } else if (activeTool === 'favicon') {
        result = `Favicon URL: ${url.replace(/\/$/, '')}/favicon.ico\n\nPreview:\n${url.replace(/\/$/, '')}/favicon.ico`;
      } else if (activeTool === 'tech') {
        result = `Analyzing: ${url}\n\nDetected (simulated):\n- Server: CloudFlare\n- Framework: React\n- CMS: WordPress\n- Analytics: Google Analytics\n- CDN: CloudFlare\n\nNote: Full detection requires backend`;
      } else {
        result = `Tool: ${activeTool}\nURL: ${url}\n\n[Requires backend integration for full analysis]\n\nTip: Check browser DevTools for client-side analysis`;
      }
      setOutput(result);
      toast.success('Analyzed!');
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-400">🕸️ Web Analyzer Hub</h1>
              <p className="text-slate-400 text-sm">10 Web Analysis Tools</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono mb-4" />
          <button onClick={analyze} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg">🔍 Analyze</button>
          {output && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-blue-300 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">{output}</div>
          )}
        </div>
      </div>
    </div>
  );
}
