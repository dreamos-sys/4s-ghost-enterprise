import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './lib/supabase';
import TestTool from './tools/TestTool.jsx';

const toolComponents = {
  '/tools/TestTool': TestTool,
};

function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  window.navigateTool = (route) => {
    console.log('navigateTool called with', route);
    setCurrentRoute(route);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff9d', fontFamily: 'Courier New, monospace' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const ToolComponent = toolComponents[currentRoute];

  if (ToolComponent) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505' }}>
        <ToolComponent onBack={() => setCurrentRoute('/')} />
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
