import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'password' | 'uuid' | 'mac' | 'identity' | 'cc' | 'lorem' | 'color' | 'qr' | 'apikey' | 'pin';

export default function GeneratorHub() {
  const [activeTool, setActiveTool] = useState<Tool>('password');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<any>({ length: 16, upper: true, lower: true, numbers: true, symbols: true });
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'password', name: 'Password', icon: '🔐' },
    { id: 'uuid', name: 'UUID v4', icon: '🆔' },
    { id: 'mac', name: 'MAC Addr', icon: '🔌' },
    { id: 'identity', name: 'Fake ID', icon: '👤' },
    { id: 'cc', name: 'Test CC', icon: '💳' },
    { id: 'lorem', name: 'Lorem', icon: '📝' },
    { id: 'color', name: 'Color', icon: '🎨' },
    { id: 'qr', name: 'QR Code', icon: '📱' },
    { id: 'apikey', name: 'API Key', icon: '🔑' },
    { id: 'pin', name: 'PIN', icon: '🔢' },
  ];

  const generate = () => {
    let result = '';
    if (activeTool === 'password') {
      let chars = '';
      if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (options.numbers) chars += '0123456789';
      if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      result = Array.from({length: options.length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } else if (activeTool === 'uuid') {
      result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    } else if (activeTool === 'mac') {
      result = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
    } else if (activeTool === 'identity') {
      const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
      const emails = ['gmail.com', 'yahoo.com', 'outlook.com'];
      const name = firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
      result = `Name: ${name}\nEmail: ${name.toLowerCase().replace(' ', '.')}@${emails[Math.floor(Math.random() * emails.length)]}\nPhone: +1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}\nAddress: ${Math.floor(Math.random() * 9999)} Main St, City`;
    } else if (activeTool === 'cc') {
      const prefixes = ['4', '5', '37', '6'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const num = prefix + Array.from({length: 15 - prefix.length}, () => Math.floor(Math.random() * 10)).join('');
      result = `Card: ${num.match(/.{1,4}/g)?.join(' ')}\nCVV: ${Math.floor(Math.random() * 900 + 100)}\nExp: ${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}/${Math.floor(Math.random() * 5 + 25)}`;
    } else if (activeTool === 'lorem') {
      const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
      result = Array.from({length: 50}, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
    } else if (activeTool === 'color') {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      result = `HEX: ${hex}\nRGB: ${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}`;
    } else if (activeTool === 'qr') {
      result = 'Enter text in options, then visit:\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(options.text || 'Hello');
    } else if (activeTool === 'apikey') {
      result = 'sk_' + Array.from({length: 48}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
    } else if (activeTool === 'pin') {
      result = Array.from({length: options.length || 6}, () => Math.floor(Math.random() * 10)).join('');
    }
    setOutput(result);
    toast.success('Generated!');
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success('Copied!'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">🎲 Generator Hub</h1>
              <p className="text-slate-400 text-sm">10 Random Generators</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-purple-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          {activeTool === 'password' && (
            <div className="space-y-3 mb-4">
              <div className="flex gap-4 items-center">
                <label className="text-slate-300">Length: {options.length}</label>
                <input type="range" min="8" max="64" value={options.length} onChange={(e) => setOptions({...options, length: +e.target.value})} className="flex-1" />
              </div>
              <div className="flex gap-4 flex-wrap">
                {['upper', 'lower', 'numbers', 'symbols'].map(k => (
                  <label key={k} className="flex items-center gap-2 text-slate-300">
                    <input type="checkbox" checked={options[k]} onChange={(e) => setOptions({...options, [k]: e.target.checked})} />
                    {k}
                  </label>
                ))}
              </div>
            </div>
          )}
          {activeTool === 'qr' && (
            <input type="text" value={options.text || ''} onChange={(e) => setOptions({...options, text: e.target.value})} placeholder="Text for QR..." className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white mb-4" />
          )}
          <button onClick={generate} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg mb-4">🎲 Generate</button>
          {output && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Result:</span>
                <button onClick={copy} className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded">📋 Copy</button>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-purple-300 whitespace-pre-wrap break-all">{output}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
