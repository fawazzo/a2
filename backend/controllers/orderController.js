// backend/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import MenuItem from '../models/menuItemModel.js';
import Restaurant from '../models/restaurantModel.js';

// --- Customer Logic ---

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const addOrderItems = asyncHandler(async (req, res) => {
  const { restaurantId, orderItems, customerAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items found');
  }

  // 1. Validate restaurant
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || !restaurant.isActive) {
    res.status(404);
    throw new Error('Restaurant not found or is currently closed');
  }

  // 2. Validate items and calculate total
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const dbItem = await MenuItem.findById(item.menuItemId);

    if (!dbItem || dbItem.restaurant.toString() !== restaurantId) {
      res.status(404);
      throw new Error(`Item ${item.menuItemId} not valid for this restaurant`);
    }

    // Build the snapshot item for the order
    validatedItems.push({
      menuItem: dbItem._id,
      name: dbItem.name,
      quantity: item.quantity,
      priceAtTimeOfOrder: dbItem.price,
    });
    totalAmount += dbItem.price * item.quantity;
  }

  // 3. Create the Order
  const order = new Order({
    customer: req.user._id,
    restaurant: restaurantId,
    items: validatedItems,
    totalAmount: totalAmount,
    customerAddress: customerAddress || req.user.address, // Use address provided or customer profile address
    status: 'Pending',
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get all orders for the logged-in customer
// @route   GET /api/orders/customer
// @access  Private/Customer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate('restaurant', 'name address')
    .sort({ createdAt: -1 });
  res.json(orders);
});


// --- Restaurant Logic ---

// @desc    Get all orders received by the logged-in restaurant
// @route   GET /api/orders/restaurant
// @access  Private/Restaurant
const getRestaurantOrders = asyncHandler(async (req, res) => {
  // Find orders belonging to the logged-in restaurant user
  const orders = await Order.find({ restaurant: req.user._id })
    .populate('customer', 'name email address')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Update order status (The critical flow logic)
// @route   PUT /api/orders/:id/status
// @access  Private/Restaurant
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Security Check: Ensure the order belongs to the logged-in restaurant
  if (order.restaurant.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to modify this order');
  }

  // --- Status Transition Logic ---
  const validTransitions = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Preparing', 'Cancelled'],
    Preparing: ['Out for Delivery'],
    'Out for Delivery': ['Delivered'],
    Delivered: [],
    Cancelled: [],
  };

  const currentStatus = order.status;

  if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
    res.status(400);
    throw new Error(`Order is already ${currentStatus} and cannot be updated.`);
  }

  if (validTransitions[currentStatus].includes(status)) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(400);
    throw new Error(
      `Invalid status transition: cannot move from ${currentStatus} to ${status}`
    );
  }
});

export {
  addOrderItems,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
};