// src/pages/restaurant/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import OrderList from '../../pages/restaurant/OrderList';

const RestaurantDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders received by this restaurant
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders/restaurant');
            setOrders(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch restaurant orders.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to handle status update from OrderList component
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            
            // Update the local state with the new order data
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId ? data : order
                )
            );
            alert(`Order ${orderId} status updated to ${newStatus}`);

        } catch (err) {
            alert(`Error updating status: ${err.response?.data?.message || 'Invalid transition.'}`);
        }
    };

    if (loading) return <div className="text-center text-xl text-primary-dark">Loading Dashboard...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
    const completedOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-primary-orange">Welcome Back, {user.name}</h1>
            
            {/* Quick Actions */}
            <div className="flex space-x-4">
                <Link 
                    to="/restaurant/menu" 
                    className="bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark/90 transition shadow-lg"
                >
                    Manage Menu Items
                </Link>
                <div className="bg-white p-3 rounded-lg shadow-md flex items-center">
                    <span className="text-xl font-bold text-primary-orange">{activeOrders.length}</span>
                    <span className="ml-2 text-gray-600">Active Orders</span>
                </div>
            </div>

            {/* Active Orders Section */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Current Incoming Orders</h2>
                
                {activeOrders.length === 0 ? (
                    <p className="text-gray-500 italic">No new or active orders at this time.</p>
                ) : (
                    <OrderList 
                        orders={activeOrders} 
                        handleStatusUpdate={handleStatusUpdate} 
                        isRestaurantView={true} 
                    />
                )}
            </div>

            {/* History Section */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Order History ({completedOrders.length})</h2>
                {completedOrders.length > 0 && (
                    <OrderList 
                        orders={completedOrders} 
                        handleStatusUpdate={handleStatusUpdate} 
                        isRestaurantView={true} 
                    />
                )}
            </div>
        </div>
    );
};

export default RestaurantDashboard;