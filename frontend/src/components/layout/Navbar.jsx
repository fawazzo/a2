// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'customer') return '/customer/dashboard';
    if (role === 'restaurant') return '/restaurant/dashboard';
    return '/';
  };

  return (
    <header className="bg-primary-orange shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wider hover:text-white/90">
          YEMEKSEPETİ CLONE
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-secondary-light transition duration-200">
            Restaurants
          </Link>

          {isAuthenticated ? (
            <>
              {/* Logged In Links */}
              <Link 
                to={getDashboardPath()} 
                className="text-white font-medium hover:text-secondary-light transition duration-200"
              >
                {user?.name || 'Dashboard'}
              </Link>

              {role === 'customer' && (
                <Link 
                  to="/customer/orders" 
                  className="text-white hover:text-secondary-light transition duration-200"
                >
                  My Orders
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="bg-white text-primary-orange font-semibold py-1.5 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Not Logged In Links */}
              <div className="group relative">
                <button className="text-white hover:text-secondary-light">
                  Login
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <Link to="/customer/login" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-t-md">
                    Customer Login
                  </Link>
                  <Link to="/restaurant/login" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-b-md">
                    Restaurant Login
                  </Link>
                </div>
              </div>

              <div className="group relative">
                <button className="bg-primary-dark text-white font-semibold py-1.5 px-4 rounded-full shadow-lg hover:bg-primary-dark/90 transition duration-200">
                  Register
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <Link to="/customer/register" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-t-md">
                    Customer Register
                  </Link>
                  <Link to="/restaurant/register" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-b-md">
                    Restaurant Register
                  </Link>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;