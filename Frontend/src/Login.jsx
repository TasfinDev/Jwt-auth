import React from 'react';
import { useState } from "react";
import axios from 'axios';
import {useAuth} from './context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const {accessToken, setAccessToken} = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit handler called");
    try {
      const response = await axios.post(`${API_URL}/api/routes/login`, form, { withCredentials: true });
      const token = response?.data?.accessToken;
      if (token) {
        setAccessToken(token);
        navigate('/User'); // Redirect to protected route after login
        console.log('received accessToken from server:', token);
      } else {
        console.warn('No accessToken returned from login endpoint', response.data);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };
  return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Log in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm/6 font-medium text-gray-100">Email address</label>
        <div className="mt-1">
          <input id="email" type="email" name="email" value={form.email} required onChange={handleChange} autoComplete="email"
           className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm/6 font-medium text-gray-100">Password</label>
          
        </div>
        <div className="mt-1">
          <input id="password" type="password" name="password" required value={form.password} onChange={handleChange} autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
      </div>
    </form>

    <p className="mt-10 text-center text-sm/6 text-gray-400">
      Not a member?
      <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Log in</a>
    </p>
  </div>
</div>

  )
}

export default Login
