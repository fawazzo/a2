// src/pages/auth/RestaurantRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RestaurantRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cuisineType: '',
        address: '',
        description: '',
    });
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // API call to the Restaurant specific registration endpoint
            const { data } = await axios.post('/api/auth/restaurant/register', formData);
            
            login(data);
            navigate('/restaurant/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Restaurant registration failed.');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center text-primary-orange mb-6">Register Your Restaurant</h2>
                
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Column 1 */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Restaurant Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cuisineType">Cuisine Type (e.g., Italian, Turkish)</label>
                        <input type="text" id="cuisineType" name="cuisineType" value={formData.cuisineType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>

                    {/* Column 2 */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email (Login)</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>

                    {/* Full Row Fields */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">Address</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">Description (Max 200 chars)</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} maxLength="200" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange"></textarea>
                    </div>
                    
                    <button type="submit" className="md:col-span-2 mt-4 w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200">
                        Register Restaurant
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already registered?{' '}
                    <Link to="/restaurant/login" className="text-primary-orange hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RestaurantRegister;