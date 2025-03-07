import React, { useState, useEffect } from 'react';
import PostcardCreator from './components/PostcardCreator';
import AdminDashboard from './components/admin/AdminDashboard';
import DevTools from './components/DevTools';
import ImageDebugger from './components/ImageDebugger';

function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Simple route-based rendering
  const renderContent = () => {
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    } else {
      return <PostcardCreator />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
      <DevTools />
      <ImageDebugger />
    </div>
  );
}

export default App;