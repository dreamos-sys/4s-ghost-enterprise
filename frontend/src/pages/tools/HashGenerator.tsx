import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hashApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [result, setResult] = useState<any>(null);
  const [allHashes, setAllHashes] = useState<any>(null);
  const [detectInput, setDetectInput] = useState('');
  const [detectResult, setDetectResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter text to hash');
      return;
    }
    setLoading(true);
    try {
      const res = await hashApi.generate(input, algorithm);
      setResult(res.data);
      toast.success('Hash generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate hash');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!input.trim()) {
      toast.error('Please enter text to hash');
      return;
    }
    setLoading(true);
    try {
      const res = await hashApi.generateAll(input);
      setAllHashes(res.data);
      toast.success('All hashes generated!');
    } catch (error: any) {
      toast.error('Failed to generate hashes');
    } finally {
      setLoading(false);
    }
  };

  const handleDetect = async () => {
    if (!detectInput.trim()) {
      toast.error('Please enter a hash to detect');
      return;
    }
    try {
      const res = await hashApi.detect(detectInput.trim());
      setDetectResult(res.data);
    } catch (error: any) {
      toast.error('Detection failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">🔐 Hash Generator</h1>
              <p className="text-slate-400">Generate and analyze cryptographic hashes</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-all">
              ← Back
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['generate', 'detect', 'compare'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'generate' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Input Text</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash..."
                className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-none mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Algorithm</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="md5">MD5 (32 chars)</option>
                    <option value="sha1">SHA1 (40 chars)</option>
                    <option value="sha256">SHA256 (64 chars)</option>
                    <option value="sha512">SHA512 (128 chars)</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ Generating...' : '🔐 Generate Hash'}
                  </button>
                  <button
                    onClick={handleGenerateAll}
                    disabled={loading}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                  >
                    All
                  </button>
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-cyan-400">📊 Result</h2>
                  <button
                    onClick={() => copyToClipboard(result.hash)}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
                  >
                    📋 Copy Hash
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-slate-400 text-xs mb-1">Algorithm</div>
                    <div className="text-white text-lg font-bold">{result.algorithm}</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-slate-400 text-xs mb-1">Hash</div>
                    <div className="text-cyan-400 font-mono text-sm break-all">{result.hash}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Input length: {result.inputLength} characters
                  </div>
                </div>
              </div>
            )}

            {allHashes && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 All Hashes</h2>
                <div className="space-y-3">
                  {Object.entries(allHashes.hashes).map(([algo, hash]) => (
                    <div key={algo} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white font-bold uppercase">{algo}</div>
                        <button
                          onClick={() => copyToClipboard(hash as string)}
                          className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <div className="text-cyan-400 font-mono text-xs break-all">{hash as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'detect' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Hash to Detect</label>
              <input
                type="text"
                value={detectInput}
                onChange={(e) => setDetectInput(e.target.value)}
                placeholder="Paste a hash here..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm mb-4"
              />
              <button
                onClick={handleDetect}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                🔍 Detect Hash Type
              </button>
            </div>

            {detectResult && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">🎯 Detection Result</h2>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Detected Type</div>
                  <div className="text-3xl font-bold text-green-400">{detectResult.detectedType}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🔍 Hash Comparison</h2>
            <p className="text-slate-400 text-sm mb-4">Coming soon: Compare multiple hashes and detect collisions</p>
          </div>
        )}
      </div>
    </div>
  );
}
