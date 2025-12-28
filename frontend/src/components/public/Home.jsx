// src/pages/public/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../../components/public/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get('/api/restaurants');
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurants.');
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center text-xl text-primary-dark">Loading Restaurants...</div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-primary-dark mb-8 text-center">
        Discover Delicious Food Near You
      </h1>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search restaurants by name or cuisine..."
          className="w-full max-w-xl px-6 py-3 border-2 border-primary-orange rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))
        ) : (
          <p className="col-span-full text-center text-xl text-gray-500">
            No restaurants found matching "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;