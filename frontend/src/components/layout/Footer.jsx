// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Yemeksepeti Clone. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Built with React, Node, and Orange.</p>
      </div>
    </footer>
  );
};

export default Footer;