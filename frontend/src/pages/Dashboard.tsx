import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">👻 4S Ghost Enterprise</h1>
              <p className="text-slate-400">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Email</h3>
            <p className="text-white text-lg">{user?.email}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Role</h3>
            <p className="text-cyan-400 text-lg capitalize">{user?.role}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Member Since</h3>
            <p className="text-white text-lg">{new Date(user?.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">🛠️ Security Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Port Scanner', 'JWT Decoder', 'XSS Finder', 'SQL Injection', 'Honeypot', 'Rate Limiter', 'Bot Detector', 'AI Defense'].map((tool) => (
              <div key={tool} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 transition-all">
                <div className="text-3xl mb-2">🔧</div>
                <div className="text-slate-300 text-sm">{tool}</div>
                <div className="text-xs text-slate-500 mt-1">Coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
