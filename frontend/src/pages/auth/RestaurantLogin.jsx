// src/pages/auth/RestaurantLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RestaurantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // API call to the Restaurant specific login endpoint
      const { data } = await axios.post('/api/auth/restaurant/login', { email, password });
      
      // Use the global login function to store token and user details
      login(data); 
      
      // Navigate to the Restaurant Dashboard
      navigate('/restaurant/dashboard');
    } catch (err) {
      // Handle backend errors (e.g., Invalid email or password)
      setError(err.response?.data?.message || 'Login failed. Check your restaurant credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary-orange mb-6">Restaurant Owner Login</h2>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Restaurant Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Sign In as Restaurant
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Not registered yet?{' '}
          <Link to="/restaurant/register" className="text-primary-orange hover:underline font-medium">
            Register your Restaurant
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantLogin;