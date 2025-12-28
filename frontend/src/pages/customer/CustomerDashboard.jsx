// src/pages/customer/CustomerDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-primary-orange">
                Welcome, {user.name}
            </h1>
            <p className="text-xl text-primary-dark">
                You are ready to discover and order delicious food!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-orange">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Your Profile</h2>
                    <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    <p><strong>Default Address:</strong> {user.address || 'N/A'}</p>
                    {/* Add Edit Profile functionality here if desired later */}
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-orange">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link 
                            to="/customer/orders" 
                            className="block w-full text-center bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark/90 transition"
                        >
                            View My Orders
                        </Link>
                        <Link 
                            to="/" 
                            className="block w-full text-center bg-primary-orange text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-orange/90 transition"
                        >
                            Browse Restaurants
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;