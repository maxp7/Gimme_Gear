import { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hello`)
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => console.error('API fetch error:', err));
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <p>API message: {msg}</p>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>
    </>
  );
}

export default App;
