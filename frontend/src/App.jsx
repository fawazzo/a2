// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages - Public
import Home from './components/public/Home';
import RestaurantDetail from './components/public/RestaurantDetail';

// Pages - Auth
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import RestaurantLogin from './pages/auth/RestaurantLogin';
import RestaurantRegister from './pages/auth/RestaurantRegister';

// Pages - Protected
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerOrders from './pages/customer/CustomerOrders';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';

import './App.css';


// Component for Protected Routes based on Role
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>; // Should handle this better in production

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};


const AppContent = () => {
    const { role } = useAuth();

    return (
        <>
            <Navbar />
            <main className="min-h-[80vh] py-8 bg-secondary-light">
                <div className="container mx-auto px-4">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/restaurant/:id" element={<RestaurantDetail />} />

                        {/* Auth Routes */}
                        <Route path="/customer/login" element={<CustomerLogin />} />
                        <Route path="/customer/register" element={<CustomerRegister />} />
                        <Route path="/restaurant/login" element={<RestaurantLogin />} />
                        <Route path="/restaurant/register" element={<RestaurantRegister />} />

                        {/* Customer Protected Routes */}
                        <Route 
                            path="/customer/dashboard" 
                            element={<ProtectedRoute element={<CustomerDashboard />} requiredRole="customer" />} 
                        />
                        <Route 
                            path="/customer/orders" 
                            element={<ProtectedRoute element={<CustomerOrders />} requiredRole="customer" />} 
                        />
                        
                        {/* Restaurant Protected Routes */}
                        <Route 
                            path="/restaurant/dashboard" 
                            element={<ProtectedRoute element={<RestaurantDashboard />} requiredRole="restaurant" />} 
                        />
                        <Route 
                            path="/restaurant/menu" 
                            element={<ProtectedRoute element={<MenuManagement />} requiredRole="restaurant" />} 
                        />

                        {/* Redirect logged-in users to their respective dashboards */}
                        {role === 'customer' && <Route path="/login" element={<Navigate to="/customer/dashboard" />} />}
                        {role === 'restaurant' && <Route path="/login" element={<Navigate to="/restaurant/dashboard" />} />}

                    </Routes>
                </div>
            </main>
            <Footer />
        </>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;