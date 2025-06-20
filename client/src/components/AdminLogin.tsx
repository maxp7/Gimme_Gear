import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
    const navigate = useNavigate();
   const handleLogout = () => {
    localStorage.removeItem('authToken');
    setStatus('Logged out.');

  };
 
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      setStatus('Login successful!');
      navigate('/admin')
    } catch (error: any) {
      setStatus(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleLogin} style={{ width: '100%' }}>Login</button>
      {status && <p style={{ marginTop: '1rem', color: status.includes('successful') ? 'green' : 'red' }}>{status}</p>}
      <button onClick={handleLogout} style={{ marginTop: '1rem', width: '100%' }}>
        Logout
      </button>
    </div>
  );
};

export default AdminLogin;
