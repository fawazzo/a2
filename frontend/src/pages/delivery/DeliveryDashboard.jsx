// src/pages/delivery/DeliveryDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OrderList from '../restaurant/OrderList'; 

const DeliveryDashboard = () => {
    const { user } = useAuth();
    const [availableOrders, setAvailableOrders] = useState([]); // Orders ready for pickup (status: Out for Delivery, unassigned)
    const [activeDeliveries, setActiveDeliveries] = useState([]); // Orders actively being delivered (status: Delivering, assigned to user)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch both lists of orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            
            // 1. Fetch orders ready for *this* delivery person (Active Deliveries - status: Delivering)
            const { data: activeData } = await axios.get('/api/orders/delivery/active');
            setActiveDeliveries(activeData);
            
            // 2. Fetch orders ready for *any* delivery person (Available Orders - status: Out for Delivery)
            const { data: availableData } = await axios.get('/api/orders/delivery/available');
            setAvailableOrders(availableData);
            
            setLoading(false);
        } catch (err) {
            setError('Sipariş listeleri alınamadı.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // Function to handle Delivery Person claiming an order (sets status to 'Delivering')
    const handleAcceptOrder = async (orderId) => {
        if (!window.confirm('Bu siparişi teslimat için almak istediğinizden emin misiniz?')) return;
        
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/accept`);
            
            alert(`Sipariş ${data._id} başarıyla teslimat için alındı! Durum: ${data.status}`);
            fetchOrders(); // Re-fetch to move the order from 'Available' to 'Active' list

        } catch (err) {
            alert(`Sipariş alınırken hata oluştu: ${err.response?.data?.message || 'Zaten alınmış olabilir.'}`);
        }
    };
    
    // Function to handle Delivery Person completing the delivery (sets status to 'Delivered')
    const handleStatusUpdate = async (orderId, newStatus) => {
        if (newStatus !== 'Delivered') return; // Safety check for delivery role

        if (!window.confirm('Siparişi tamamlandı (Teslim Edildi) olarak işaretlemek istediğinizden emin misiniz?')) return;
        
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            
            alert(`Sipariş ${orderId} durumu ${newStatus} olarak güncellendi.`);
            fetchOrders(); // Re-fetch to remove from active list

        } catch (err) {
            alert(`Durum güncellenirken hata oluştu: ${err.response?.data?.message || 'Geçersiz geçiş.'}`);
        }
    };

    if (loading) return <div className="text-center text-xl text-primary-dark">Teslimat Paneli Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    // Helper component to render a card for available orders (since OrderList is too complex here)
    const AvailableOrderCard = ({ order }) => (
        <div className="p-4 border rounded-lg bg-secondary-light shadow-md border-l-4 border-primary-orange flex justify-between items-center">
            <div>
                <p className="text-lg font-bold text-primary-dark">Restoran: {order.restaurant.name}</p>
                <p className="text-sm text-gray-500">Teslimat Adresi: {order.customerAddress}</p>
                <p className="text-sm font-medium text-red-600">Durum: Teslim Alınmayı Bekliyor</p>
            </div>
            <button
                onClick={() => handleAcceptOrder(order._id)}
                className="py-2 px-4 text-sm font-semibold rounded-lg text-white bg-primary-orange hover:bg-primary-orange/90 transition"
            >
                Siparişi Teslim Al
            </button>
        </div>
    );
    
    // CORRECTED: Simple wrapper to pass active deliveries to OrderList without status override.
    const ActiveOrderListWrapper = ({ orders }) => {
        return (
            <OrderList 
                orders={orders} // PASS THE ORDERS WITH CORRECT STATUS ('Delivering')
                handleStatusUpdate={handleStatusUpdate} 
                isRestaurantView={true} 
            />
        );
    }

    return (
        <div className="space-y-10">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-dark">Teslimat Kontrol Paneli, {user.name}</h1>
            
            {/* 1. Available Orders (Ready for Pickup) */}
            <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-orange">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">TESLİMAT İÇİN HAZIR (Bekleyen) ({availableOrders.length})</h2>
                
                {availableOrders.length === 0 ? (
                    <p className="text-gray-500 italic">Şu anda teslim alabileceğiniz hazır sipariş bulunmamaktadır.</p>
                ) : (
                    <div className="space-y-4">
                        {availableOrders.map(order => <AvailableOrderCard key={order._id} order={order} />)}
                    </div>
                )}
            </div>

            {/* 2. My Active Deliveries (On the Way) */}
            <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-dark">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">AKTİF TESLİMATLARIM ({activeDeliveries.length})</h2>
                
                {activeDeliveries.length === 0 ? (
                    <p className="text-gray-500 italic">Şu anda teslimatta olan bir siparişiniz bulunmamaktadır.</p>
                ) : (
                    <ActiveOrderListWrapper orders={activeDeliveries} />
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;