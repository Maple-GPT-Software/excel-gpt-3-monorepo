import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check auth token here and check whether or not to show chat application
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
    }, 500);
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Chat />;
}

export default App;
