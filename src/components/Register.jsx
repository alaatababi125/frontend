import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegisterSuccess, onSwitch }) => {
  // Added phoneNumber to form state key tracking
  const [formData, setFormData] = useState({ username: '', password: '', phoneNumber: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check block before hitting backend network request
    if (!formData.phoneNumber.trim()) {
      alert("Please enter a valid phone number to create an account!");
      return;
    }

    try {
      System.out.log("Attempting to register user:", formData.username);
      await axios.post('http://localhost:8082/api/auth/register', formData);
      
      alert("Registration successful! Redirecting to login...");
      
      // This function comes from App.jsx and will set authMode to 'login'
      onRegisterSuccess(); 
    } catch (err) {
      System.out.error("Registration error:", err);
      // Fallback message showing backend response error messages if available
      const errorMessage = err.response?.data || "Registration failed. This username might already exist.";
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Create Account</h2>
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

        {/* NEW PHONE NUMBER INPUT FIELD CONTAINER */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
          <input 
            type="tel" 
            placeholder="Ex: 98765432" 
            required
            className="w-full p-3 border rounded-xl bg-slate-50 focus:outline-blue-500 transition-all text-sm"
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all mt-2">
          Register
        </button>
      </form>
      
      <p className="mt-6 text-sm text-center text-slate-500">
        Already have an account? {' '}
        <button 
          type="button"
          className="text-blue-600 font-bold hover:underline" 
          onClick={onSwitch}
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;