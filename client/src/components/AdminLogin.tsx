import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type AdminLoginProps = {
  isLoginVisible: boolean;
  setIsLoginVisible: (visible: boolean) => void;
};

const AdminLogin: React.FC<AdminLoginProps> = ({ isLoginVisible, setIsLoginVisible }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');

  };


  const handleLogin = async () => {
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
      navigate('/admin')
    } catch (error: any) {
    }
  };
  

  return (
    <div
      ref={loginRef}
      className={`
      absolute flex flex-col top-[8rem] left-1/2 transform -translate-x-1/2 
      w-[50%] h-[25rem] bg-gray-600/90 p-2 shadow rounded-[20px] 
      transition-all duration-300 ease-out z-50
      ${isLoginVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
  `}>
      <div className='flex flex-col width-100% p-4'>
        <div>
          <div className='flex flex-col pl-2 text-xl'>
            Login
            <input
              type="text"
              placeholder="Max-Musterman@htw-berlin.de"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='width-100% h-[3rem] text-left mx-2 my-4 pl-2 bg-[white] text-[black] text-base rounded-[15px]'
            />
          </div>
          <div className='flex flex-col pl-2 text-xl'>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='width-100% h-[3rem] text-left mx-2 my-4 pl-2 bg-[white] text-[black] text-base rounded-[15px]'
            />
          </div>
        </div>
      </div>
      <div className='px-4 mt-6 flex flex-col width-100%'>
        <button onClick={handleLogin} className='width-[100%] h-[3rem] text-center m-2 pl-2 bg-[black] text-[white] rounded-[15px]'>
          Sign in</button>

        <button onClick={handleLogout}>
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
