import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type LoginDropDownProps = {
  isLoginVisible: boolean;
  isDropdownVisible: boolean;
  setIsLoginVisible: (visible: boolean) => void;
};

const LoginDropDown: React.FC<LoginDropDownProps> = ({ isLoginVisible, setIsLoginVisible }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>(''); // 👈

  const navigate = useNavigate();
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        setIsLoginVisible(false);
      }
    };

    if (isLoginVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginVisible, setIsLoginVisible]);

  const handleLogin = async () => {
    setErrorMessage(''); // 👈 clear old error
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      setIsLoginVisible(false);
      navigate('/admin');
    } catch (error: any) {
      console.error(error);
      setErrorMessage('Benutzername oder Passwort ist falsch');
    }
  };

  return (
    <div
      ref={loginRef}
      className={`
        absolute top-[3.5rem] right-4 w-full text-black bg-white shadow-lg rounded-xl
        p-4 z-10 transition-all duration-300 ease-out
        ${isLoginVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
    >
      <div className='w-[40vw] m-auto'>
        <div className='flex flex-col justify-center items-center'>
          <h3 className="text-lg font-semibold mb-2">Anmelden</h3>

          <div className="flex w-[60%] flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 text-black py-2 border rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 text-black py-2 border rounded-md text-sm"
            />
            {errorMessage && (
              <p className="text-red-600 text-sm mt-1">{errorMessage}</p> // 👈
            )}
          </div>

          <div className="flex flex-col w-[60%]">
            <button 
              onClick={handleLogin}
              className="bg-black text-white w-full py-2 px-3 rounded-md text-sm hover:bg-gray-800 hover:cursor-pointer"
            >
              Einloggen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDropDown;
