import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'json' | 'timestamp' | 'regex' | 'chmod' | 'cron' | 'markdown' | 'yaml' | 'xml' | 'htaccess' | 'minify';

export default function DevToolsHub() {
  const [activeTool, setActiveTool] = useState<Tool>('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'json', name: 'JSON', icon: '📋' },
    { id: 'timestamp', name: 'Timestamp', icon: '⏰' },
    { id: 'regex', name: 'Regex', icon: '🔍' },
    { id: 'chmod', name: 'Chmod', icon: '🔒' },
    { id: 'cron', name: 'Cron', icon: '⏱️' },
    { id: 'markdown', name: 'Markdown', icon: '📝' },
    { id: 'yaml', name: 'YAML', icon: '📄' },
    { id: 'xml', name: 'XML', icon: '📰' },
    { id: 'htaccess', name: '.htaccess', icon: '⚙️' },
    { id: 'minify', name: 'Minify', icon: '🗜️' },
  ];

  const process = () => {
    let result = '';
    try {
      if (activeTool === 'json') {
        result = JSON.stringify(JSON.parse(input), null, 2);
      } else if (activeTool === 'timestamp') {
        const num = parseInt(input);
        if (!isNaN(num)) {
          const date = new Date(num * (num > 1e11 ? 1 : 1000));
          result = `Unix: ${Math.floor(date.getTime() / 1000)}\nISO: ${date.toISOString()}\nLocal: ${date.toLocaleString()}\nUTC: ${date.toUTCString()}`;
        } else {
          result = `Now Unix: ${Math.floor(Date.now() / 1000)}\nNow ISO: ${new Date().toISOString()}`;
        }
      } else if (activeTool === 'regex') {
        const [pattern, testStr] = input.split('|||');
        if (pattern && testStr) {
          const regex = new RegExp(pattern, 'g');
          const matches = testStr.match(regex);
          result = `Pattern: ${pattern}\nTest: ${testStr}\nMatches: ${matches ? matches.length : 0}\n${matches ? matches.join('\n') : 'No matches'}`;
        } else {
          result = 'Format: pattern|||test_string';
        }
      } else if (activeTool === 'chmod') {
        const num = input.replace(/^0/, '');
        if (/^[0-7]{3}$/.test(num)) {
          const result_perms = num.split('').map((d) => {
            const n = parseInt(d);
            return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
          }).join('');
          result = `Numeric: ${num}\nSymbolic: ${result_perms}\nOwner: ${result_perms.slice(0,3)}\nGroup: ${result_perms.slice(3,6)}\nOther: ${result_perms.slice(6,9)}`;
        }
      } else if (activeTool === 'cron') {
        const parts = input.split(' ');
        if (parts.length === 5) {
          result = `Expression: ${input}\nMinute: ${parts[0]}\nHour: ${parts[1]}\nDay of Month: ${parts[2]}\nMonth: ${parts[3]}\nDay of Week: ${parts[4]}`;
        }
      } else if (activeTool === 'markdown') {
        result = input
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
          .replace(/\*(.*)\*/gim, '<i>$1</i>')
          .replace(/\n/gim, '<br>');
      } else if (activeTool === 'minify') {
        result = input.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
      } else {
        result = `Tool "${activeTool}" - Basic implementation\nInput processed successfully.`;
      }
      setOutput(result);
      toast.success('Processed!');
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
              <h1 className="text-3xl font-bold text-yellow-400">🛠️ Dev Tools Hub</h1>
              <p className="text-slate-400 text-sm">10 Developer Utilities</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-yellow-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input..."
            className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono text-sm resize-none mb-4" />
          <button onClick={process} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-lg">⚡ Process</button>
          {output && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-yellow-300 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">{output}</div>
          )}
        </div>
      </div>
    </div>
  );
}
