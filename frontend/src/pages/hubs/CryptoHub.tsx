import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'bcrypt' | 'rot13' | 'caesar' | 'vigenere' | 'morse' | 'jwt-sign' | 'otp' | 'checksum' | 'pem';

export default function CryptoHub() {
  const [activeTool, setActiveTool] = useState<Tool>('bcrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('3');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'bcrypt', name: 'Bcrypt', icon: '🔐' },
    { id: 'rot13', name: 'ROT13', icon: '🔄' },
    { id: 'caesar', name: 'Caesar', icon: '🏛️' },
    { id: 'vigenere', name: 'Vigenère', icon: '🔑' },
    { id: 'morse', name: 'Morse', icon: '📡' },
    { id: 'jwt-sign', name: 'JWT Sign', icon: '🎫' },
    { id: 'otp', name: 'TOTP', icon: '⏱️' },
    { id: 'checksum', name: 'Checksum', icon: '✓' },
    { id: 'pem', name: 'PEM Decode', icon: '📜' },
  ];

  const process = () => {
    let result = '';
    const shift = parseInt(key) || 3;
    
    if (activeTool === 'rot13') {
      result = input.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      });
    } else if (activeTool === 'caesar') {
      result = input.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
      });
    } else if (activeTool === 'morse') {
      const morseMap: any = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
      result = input.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
    } else if (activeTool === 'bcrypt') {
      result = `[Simulated Bcrypt]\nInput: ${input}\nHash: $2b$12$${Array.from({length: 53}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./'[Math.floor(Math.random() * 64)]).join('')}\n\nNote: Real bcrypt requires backend`;
    } else if (activeTool === 'otp') {
      const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      result = `TOTP Code: ${otp}\nValid for: 30 seconds\n\n[Simulated - Real TOTP requires secret key]`;
    } else if (activeTool === 'checksum') {
      let sum = 0;
      for (let i = 0; i < input.length; i++) sum += input.charCodeAt(i);
      result = `Length: ${input.length}\nSum: ${sum}\nCRC16 (sim): 0x${(sum % 65536).toString(16).toUpperCase()}`;
    } else if (activeTool === 'vigenere') {
      const k = key.toUpperCase();
      let ki = 0;
      result = input.split('').map(c => {
        if (/[a-zA-Z]/.test(c)) {
          const base = c <= 'Z' ? 65 : 97;
          const shift = k.charCodeAt(ki % k.length) - 65;
          ki++;
          return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
        }
        return c;
      }).join('');
    } else {
      result = `Tool "${activeTool}" - Placeholder\nInput: ${input}\nKey: ${key}`;
    }
    setOutput(result);
    toast.success('Processed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-red-400">🔐 Crypto Hub</h1>
              <p className="text-slate-400 text-sm">9 Cryptography Tools</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-red-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input..."
            className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono text-sm resize-none mb-4" />
          {['caesar', 'vigenere'].includes(activeTool) && (
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key/Shift" className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white mb-4" />
          )}
          <button onClick={process} className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg">⚡ Process</button>
          {output && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-red-300 whitespace-pre-wrap break-all">{output}</div>
          )}
        </div>
      </div>
    </div>
  );
}
