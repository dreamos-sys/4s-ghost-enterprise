import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hashApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter text');
      return;
    }
    setLoading(true);
    try {
      const res = await hashApi.generate(input, algorithm);
      setResult(res.data);
      toast.success('Hash generated!');
    } catch (error: any) {
      toast.error('Failed to generate hash');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔐 Hash Generator</h1>
              <p className="text-slate-400">Generate cryptographic hashes</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50">
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-none mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="md5">MD5</option>
                <option value="sha1">SHA1</option>
                <option value="sha256">SHA256</option>
                <option value="sha512">SHA512</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Generating...' : '🔐 Generate'}
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Hash ({result.algorithm})</div>
              <div className="text-cyan-400 font-mono text-sm break-all">{result.hash}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
