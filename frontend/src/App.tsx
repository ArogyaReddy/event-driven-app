import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

interface User {
  id: string;
  username: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && !socket) {
      // Connect to WebSocket when user is logged in
      const newSocket = io('http://localhost:4000');
      
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
      });
      
      setSocket(newSocket);
      
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} socket={socket} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
