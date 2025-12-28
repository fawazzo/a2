// src/components/restaurant/OrderList.jsx
import React from 'react';

// Defines the status flow and the next possible status button text
const statusOptions = {
    Pending: { next: 'Confirmed', btnText: 'Confirm Order', color: 'bg-yellow-500' },
    Confirmed: { next: 'Preparing', btnText: 'Start Preparing', color: 'bg-blue-500' },
    Preparing: { next: 'Out for Delivery', btnText: 'Out for Delivery', color: 'bg-indigo-500' },
    'Out for Delivery': { next: 'Delivered', btnText: 'Mark Delivered', color: 'bg-green-500' },
    Delivered: { next: null, btnText: 'Delivered', color: 'bg-gray-400' },
    Cancelled: { next: null, btnText: 'Cancelled', color: 'bg-red-500' },
};

const OrderList = ({ orders, handleStatusUpdate, isRestaurantView = false }) => {

    const getStatusBadge = (status) => {
        const statusMap = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Confirmed: 'bg-blue-100 text-blue-800',
            Preparing: 'bg-indigo-100 text-indigo-800',
            'Out for Delivery': 'bg-primary-orange text-white',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>
                {status}
            </span>
        );
    };

    const OrderCard = ({ order }) => {
        const currentStatusData = statusOptions[order.status];
        const showActionButton = isRestaurantView && currentStatusData.next;

        return (
            <div className="bg-secondary-light p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-3 border-b pb-2">
                    {/* Display info based on who is viewing */}
                    {isRestaurantView ? (
                        <div>
                            <p className="text-lg font-bold text-primary-dark">Order for: {order.customer.name}</p>
                            <p className="text-sm text-gray-500">Deliver to: {order.customerAddress}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg font-bold text-primary-dark">From: {order.restaurant.name}</p>
                            <p className="text-sm text-gray-500">Total: {order.totalAmount.toFixed(2)} TL</p>
                        </div>
                    )}
                    
                    <div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                {/* Items */}
                <ul className="text-sm text-gray-700 space-y-1 my-3">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span className="font-medium">{(item.quantity * item.priceAtTimeOfOrder).toFixed(2)} TL</span>
                        </li>
                    ))}
                </ul>

                {/* Restaurant Action Buttons */}
                {showActionButton && (
                    <div className="pt-3 border-t mt-3 flex justify-end space-x-3">
                        {/* Note: In a full app, 'Cancelled' would also be an option here */}
                        <button
                            onClick={() => handleStatusUpdate(order._id, currentStatusData.next)}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg text-white ${currentStatusData.color} hover:opacity-90 transition`}
                        >
                            {currentStatusData.btnText}
                        </button>
                    </div>
                )}
                
                <p className="text-xs text-gray-400 mt-2 text-right">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <OrderCard key={order._id} order={order} />
            ))}
        </div>
    );
};

export default OrderList;