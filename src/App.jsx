import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek session saat pertama load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Dengarkan perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff9d', fontFamily: 'Courier New, monospace' }}>
        <div>
          <h2>INITIALIZING 4S GHOST...</h2>
          <p style={{fontSize: '0.8rem', color: '#00ff9d88'}}>Establishing secure connection</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada session, tampilkan Login
  if (!session) {
    return <Login />;
  }

  // Jika ada session, tampilkan Dashboard
  return <Dashboard />;
}

export default App;
