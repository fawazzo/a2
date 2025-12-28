// src/pages/public/RestaurantDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MenuList from '../../components/public/MenuList';
import CartSummary from '../../components/public/CartSummary';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, menuRes] = await Promise.all([
          axios.get(`/api/restaurants/${id}`),
          axios.get(`/api/menu/restaurant/${id}`),
        ]);
        setRestaurant(resRes.data);
        setMenu(menuRes.data);
        setLoading(false);
      } catch (err) {
        setError('Could not load restaurant or menu.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  
  // --- Cart Management Functions ---
  const addToCart = (item) => {
    // Prevent restaurants from ordering from themselves
    if (role === 'restaurant') return alert("Restaurant owners cannot place orders.");
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === itemId);

      if (existingItem.quantity === 1) {
        return prevCart.filter(cartItem => cartItem._id !== itemId);
      } else {
        return prevCart.map(cartItem =>
          cartItem._id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
    });
  };

  // --- Checkout Function ---
  const handleCheckout = async () => {
    if (!isAuthenticated || role !== 'customer') {
      alert("Please log in as a customer to place an order.");
      return navigate('/customer/login');
    }

    if (cart.length === 0) {
        return;
    }

    const orderItems = cart.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity,
    }));
    
    try {
        const orderData = {
            restaurantId: id,
            orderItems: orderItems,
            // customerAddress will be fetched from user profile on the backend, 
            // but for simplicity, we use the logged-in customer's default address.
        };

        const { data } = await axios.post('/api/orders', orderData);
        alert(`Order placed successfully! Total: ${data.totalAmount} TL. Status: ${data.status}`);
        setCart([]); // Clear cart after successful order
        navigate('/customer/orders');

    } catch (err) {
        alert(`Order failed: ${err.response?.data?.message || 'An unknown error occurred.'}`);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading Menu...</div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Restaurant Info & Menu */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-2">{restaurant.name}</h1>
        <p className="text-xl text-primary-orange mb-4">{restaurant.cuisineType}</p>
        <p className="text-gray-600 mb-6">{restaurant.description}</p>

        {/* Menu Items */}
        <MenuList menu={menu} addToCart={addToCart} />
      </div>

      {/* Cart Summary (Sticky on desktop) */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <CartSummary 
            cart={cart} 
            addToCart={addToCart} 
            removeFromCart={removeFromCart} 
            handleCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default RestaurantDetail;