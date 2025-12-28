// src/pages/customer/CustomerOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OrderList from '../../pages/restaurant/OrderList'; // Reusing the list component

const CustomerOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders placed by this customer
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Use the customer-specific backend endpoint
                const { data } = await axios.get('/api/orders/customer');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch your orders.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center text-xl text-primary-dark">Loading Orders...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
    const historyOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));


    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-primary-orange">Your Order History</h1>
            
            {/* Active Orders Section */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Active Orders ({activeOrders.length})</h2>
                
                {activeOrders.length === 0 ? (
                    <p className="text-gray-500 italic">You have no orders currently being processed.</p>
                ) : (
                    <OrderList 
                        orders={activeOrders} 
                        isRestaurantView={false} // Important: Disables status buttons
                    />
                )}
            </div>

            {/* History Section */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Completed Orders ({historyOrders.length})</h2>
                {historyOrders.length > 0 ? (
                    <OrderList 
                        orders={historyOrders} 
                        isRestaurantView={false} 
                    />
                ) : (
                    <p className="text-gray-500 italic">You haven't completed any orders yet.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;