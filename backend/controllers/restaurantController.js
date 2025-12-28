// backend/controllers/restaurantController.js
import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';

// @desc    Get all active restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true }).select('-password');
  res.json(restaurants);
});

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).select('-password');

  if (restaurant && restaurant.isActive) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found or inactive');
  }
});

// @desc    Update restaurant profile (Owner only)
// @route   PUT /api/restaurants/:id
// @access  Private/Restaurant
const updateRestaurantProfile = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    // Security Check: Ensure the logged-in user is the owner of this restaurant
    if (!restaurant || restaurant._id.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this restaurant');
    }

    if (restaurant) {
        restaurant.name = req.body.name || restaurant.name;
        restaurant.description = req.body.description || restaurant.description;
        restaurant.cuisineType = req.body.cuisineType || restaurant.cuisineType;
        restaurant.address = req.body.address || restaurant.address;
        restaurant.minOrderValue = req.body.minOrderValue ?? restaurant.minOrderValue;
        restaurant.isActive = req.body.isActive ?? restaurant.isActive; // Allow toggling activity

        const updatedRestaurant = await restaurant.save();
        res.json({
            _id: updatedRestaurant._id,
            name: updatedRestaurant.name,
            email: updatedRestaurant.email,
            cuisineType: updatedRestaurant.cuisineType,
            isActive: updatedRestaurant.isActive,
        });
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

export { getRestaurants, getRestaurantById, updateRestaurantProfile };