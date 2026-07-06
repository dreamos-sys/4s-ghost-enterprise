import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Tool = 'cidr' | 'subnet' | 'ipconv' | 'macvendor' | 'ping' | 'geo' | 'revdns' | 'asn' | 'bulkwhois' | 'traceroute';

export default function NetworkHub() {
  const [activeTool, setActiveTool] = useState<Tool>('cidr');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'cidr', name: 'CIDR Calc', icon: '🔢' },
    { id: 'subnet', name: 'Subnet', icon: '🌐' },
    { id: 'ipconv', name: 'IP Convert', icon: '🔁' },
    { id: 'macvendor', name: 'MAC Vendor', icon: '🏭' },
    { id: 'ping', name: 'Ping Sim', icon: '📡' },
    { id: 'geo', name: 'IP Geo', icon: '🗺️' },
    { id: 'revdns', name: 'Reverse DNS', icon: '🔄' },
    { id: 'asn', name: 'ASN Lookup', icon: '🏢' },
    { id: 'bulkwhois', name: 'Bulk WHOIS', icon: '📋' },
    { id: 'traceroute', name: 'Traceroute', icon: '🛤️' },
  ];

  const process = async () => {
    let result = '';
    if (activeTool === 'cidr') {
      const [ip, mask] = input.split('/');
      if (!ip || !mask) { toast.error('Format: 192.168.1.0/24'); return; }
      const maskNum = parseInt(mask);
      const totalHosts = Math.pow(2, 32 - maskNum);
      const usable = totalHosts - 2;
      const ipParts = ip.split('.').map(Number);
      const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
      const network = ipNum & (0xFFFFFFFF << (32 - maskNum));
      const broadcast = network | ((1 << (32 - maskNum)) - 1);
      const toIp = (n: number) => `${(n >> 24) & 255}.${(n >> 16) & 255}.${(n >> 8) & 255}.${n & 255}`;
      result = `Network: ${toIp(network)}\nBroadcast: ${toIp(broadcast)}\nSubnet Mask: ${toIp(0xFFFFFFFF << (32 - maskNum))}\nTotal Hosts: ${totalHosts}\nUsable Hosts: ${usable}\nFirst Host: ${toIp(network + 1)}\nLast Host: ${toIp(broadcast - 1)}`;
    } else if (activeTool === 'ipconv') {
      const parts = input.split('.').map(Number);
      const decimal = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
      result = `Decimal: ${decimal}\nHex: 0x${decimal.toString(16).toUpperCase()}\nBinary: ${decimal.toString(2).padStart(32, '0')}\nOctal: 0${decimal.toString(8)}`;
    } else if (activeTool === 'ping') {
      result = `PING ${input} (simulated):\n`;
      for (let i = 0; i < 4; i++) {
        const time = (Math.random() * 50 + 10).toFixed(2);
        result += `64 bytes: icmp_seq=${i+1} ttl=64 time=${time} ms\n`;
      }
      result += `\n--- ${input} ping statistics ---\n4 packets transmitted, 4 received, 0% loss`;
    } else if (activeTool === 'geo') {
      try {
        const res = await fetch(`https://ipapi.co/${input}/json/`);
        const data = await res.json();
        result = `IP: ${data.ip}\nCountry: ${data.country_name} (${data.country_code})\nRegion: ${data.region}\nCity: ${data.city}\nISP: ${data.org}\nTimezone: ${data.timezone}\nCoordinates: ${data.latitude}, ${data.longitude}`;
      } catch (e) {
        result = 'Failed to fetch geolocation';
      }
    } else if (activeTool === 'macvendor') {
      const prefix = input.replace(/[:-]/g, '').substring(0, 6).toUpperCase();
      result = `MAC: ${input}\nOUI Prefix: ${prefix}\nVendor: [Database lookup needed]\nNote: Full vendor DB requires backend integration`;
    } else if (activeTool === 'subnet') {
      const mask = parseInt(input);
      if (isNaN(mask) || mask < 0 || mask > 32) { toast.error('Enter 0-32'); return; }
      const binary = '1'.repeat(mask) + '0'.repeat(32 - mask);
      const dotted = binary.match(/.{1,8}/g)?.map(b => parseInt(b, 2).toString()).join('.');
      result = `/${mask}\nSubnet Mask: ${dotted}\nHosts: ${Math.pow(2, 32 - mask) - 2}`;
    } else {
      result = `Tool "${activeTool}" - Coming Soon\nInput: ${input}\n\nThis tool requires backend integration.\nCheck back in next update!`;
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
              <h1 className="text-3xl font-bold text-green-400">🌐 Network Hub</h1>
              <p className="text-slate-400 text-sm">10 Network Calculators & Tools</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">← Back</button>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setOutput(''); }}
              className={`p-3 rounded-lg text-center transition-all ${activeTool === t.id ? 'bg-green-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs mt-1">{t.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} 
            placeholder={activeTool === 'cidr' ? '192.168.1.0/24' : activeTool === 'geo' ? '8.8.8.8' : 'Input...'}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono mb-4" />
          <button onClick={process} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg">⚡ Process</button>
          {output && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm text-green-300 whitespace-pre-wrap">{output}</div>
          )}
        </div>
      </div>
    </div>
  );
}
