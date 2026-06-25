import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'base64' | 'hex' | 'url' | 'html' | 'binary' | 'octal' | 'ascii' | 'unicode';

export default function EncodingHub() {
  const [activeTool, setActiveTool] = useState<Tool>('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'base64', name: 'Base64', icon: '🔤' },
    { id: 'hex', name: 'Hex', icon: '🔢' },
    { id: 'url', name: 'URL Encode', icon: '🌐' },
    { id: 'html', name: 'HTML Entity', icon: '📄' },
    { id: 'binary', name: 'Binary', icon: '💻' },
    { id: 'octal', name: 'Octal', icon: '🎱' },
    { id: 'ascii', name: 'ASCII Codes', icon: '🔡' },
    { id: 'unicode', name: 'Unicode', icon: '🌍' },
  ];

  const process = () => {
    try {
      let result = '';
      if (activeTool === 'base64') {
        result = mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
      } else if (activeTool === 'hex') {
        result = mode === 'encode' 
          ? Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
          : input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
      } else if (activeTool === 'url') {
        result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      } else if (activeTool === 'html') {
        result = mode === 'encode'
          ? input.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] || m))
          : input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[m] || m));
      } else if (activeTool === 'binary') {
        result = mode === 'encode'
          ? Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
          : input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
      } else if (activeTool === 'octal') {
        result = mode === 'encode'
          ? Array.from(input).map(c => c.charCodeAt(0).toString(8)).join(' ')
          : input.split(' ').map(o => String.fromCharCode(parseInt(o, 8))).join('');
      } else if (activeTool === 'ascii') {
        result = mode === 'encode'
          ? Array.from(input).map(c => c.charCodeAt(0)).join(' ')
          : input.split(' ').map(n => String.fromCharCode(parseInt(n))).join('');
      } else if (activeTool === 'unicode') {
        result = mode === 'encode'
          ? Array.from(input).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
          : input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      }
      setOutput(result);
      toast.success('Processed!');
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success('Copied!'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">🔠 Encoding Hub</h1>
              <p className="text-slate-400 text-sm">8 Encoding/Decoding Tools</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-lg ${mode === 'encode' ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-300'}`}>Encode</button>
            <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-lg ${mode === 'decode' ? 'bg-purple-500 text-white' : 'bg-slate-700/50 text-slate-300'}`}>Decode</button>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input..."
            className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono text-sm resize-none mb-4" />
          <button onClick={process} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg">⚡ Process</button>
          {output && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Output:</span>
                <button onClick={copy} className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded">📋 Copy</button>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-cyan-300 break-all max-h-64 overflow-y-auto">{output}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
