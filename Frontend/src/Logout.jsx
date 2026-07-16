import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
const Logout = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const {accessToken, setAccessToken} = useAuth();
    const handleLogout = async () => {
        try {
      const response = await axios.get(`${API_URL}/api/routes/logout`,{ withCredentials: true });
       console.log("submit handler called");
       setAccessToken(null);
        navigate('/'); // Redirect to protected route after registration
      }  
     catch (error) {
      console.error("Register failed:", error.response?.data || error.message);
    }
    }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-slate-950">
      <button onClick={handleLogout} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Logout</button>
    </div>
  )
}

export default Logout
