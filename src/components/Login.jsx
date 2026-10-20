import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess, onSwitch, onSwitchToTracking }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8082/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      onLoginSuccess(res.data);
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 text-center">Login to your Account</h2>
        <p className="text-xs text-center text-slate-400 mt-1">Access your personalized dashboard and track saved orders</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Username</label>
          <input 
            type="text" 
            placeholder="Username" 
            required
            className="w-full p-3 border rounded-xl bg-slate-50 focus:outline-blue-500 transition-all text-sm"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-3 border rounded-xl bg-slate-50 focus:outline-blue-500 transition-all text-sm"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          Sign In
        </button>
      </form>
      
      <div className="text-sm text-center text-slate-500 space-y-3 pt-3 border-t border-slate-100">
        <p>
          Don't have an account?{' '}
          <button 
            type="button" 
            className="text-blue-600 font-bold hover:underline" 
            onClick={onSwitch}
          >
            Register here
          </button>
        </p>

        {/* HELP CONTAINER BLOCK FOR DISCONNECTED CLIENTS */}
        {onSwitchToTracking && (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs text-left border border-amber-100/70 mt-2">
            <span className="font-bold block mb-0.5">💡 Looking for Guest Checkout Tracking?</span>
            You don't need a profile account to track your packages. You can follow your live orders instantly using your phone details.
            <button 
              type="button"
              className="text-blue-600 font-bold block mt-1 hover:underline"
              onClick={onSwitchToTracking}
            >
              Track Order as a Guest →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;