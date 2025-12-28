// backend/controllers/restaurantAuthController.js
import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new restaurant account
// @route   POST /api/auth/restaurant/register
// @access  Public
const registerRestaurant = asyncHandler(async (req, res) => {
    const { name, email, password, cuisineType, address, description } = req.body;

    const restaurantExists = await Restaurant.findOne({ email });

    if (restaurantExists) {
        res.status(400);
        throw new Error('Restaurant account already exists with this email');
    }

    const restaurant = await Restaurant.create({
        name, email, password, cuisineType, address, description, role: 'restaurant'
    });

    if (restaurant) {
        res.status(201).json({
            _id: restaurant._id,
            name: restaurant.name,
            email: restaurant.email,
            role: restaurant.role,
            token: generateToken(restaurant._id, restaurant.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid restaurant data');
    }
});

// @desc    Auth restaurant & get token
// @route   POST /api/auth/restaurant/login
// @access  Public
const authRestaurant = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email, role: 'restaurant' });

    if (restaurant && (await restaurant.matchPassword(password))) {
        res.json({
            _id: restaurant._id,
            name: restaurant.name,
            email: restaurant.email,
            role: restaurant.role,
            token: generateToken(restaurant._id, restaurant.role),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get restaurant profile
// @route   GET /api/auth/restaurant/me
// @access  Private (Restaurant)
const getRestaurantProfile = asyncHandler(async (req, res) => {
    // req.user is set by the protect middleware
    res.json(req.user);
});


export { registerRestaurant, authRestaurant, getRestaurantProfile };