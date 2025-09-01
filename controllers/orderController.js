import Order from "../models/order.js";
import User from "../models/user.js";
import { sendMail } from "../utils/sendMail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();   


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { 
      customerId, 
      shopkeeperId, 
      amount, 
      files, 
      specifications, 
      paymentMethod, 
      deliveryAddress, 
      contactNumber 
    } = req.body;

    const order = new Order({ 
      customer: customerId, 
      shopkeeper: shopkeeperId, 
      files, 
      specifications, 
      amount, 
      paymentMethod, 
      deliveryAddress, 
      contactNumber,
      paymentStatus: 'paid',
      status: 'pending'
    });
    
    await order.save();

    // Get customer details for email
    const customer = await User.findById(customerId);
    const shopkeeper = await User.findById(shopkeeperId);

    // Email to customer
    const customerEmailContent = `
      Dear ${customer?.name || 'Customer'},
      
      Thank you for your order! Your order has been successfully placed.
      
      Order Details:
      - Order ID: ${order._id}
      - Total Amount: ₹${amount}
      - Payment Method: ${paymentMethod}
      - Files: ${files.length} file(s)
      - Specifications: ${specifications.paperSize}, ${specifications.paperType}, ${specifications.color}
      
      We will process your order and notify you once it's ready for delivery.
      
      Best regards,
      Printsaarthi Team
    `;

    // Email to shopkeeper
    const shopkeeperEmailContent = `
      New order received!
      
      Customer Details:
      - Name: ${customer?.name || 'N/A'}
      - Email: ${customer?.email || 'N/A'}
      - Phone: ${contactNumber || 'N/A'}
      
      Order Details:
      - Order ID: ${order._id}
      - Total Amount: ₹${amount}
      - Payment Method: ${paymentMethod}
      - Files: ${files.length} file(s)
      - Specifications: ${specifications.paperSize}, ${specifications.paperType}, ${specifications.color}
      - Special Instructions: ${specifications.specialInstructions || 'None'}
      
      Please process this order as soon as possible.
    `;

    // Send emails
    if (customer?.email) {
      await sendMail(customer.email, "Order Confirmation - Printsaarthi", customerEmailContent);
    }
    
    if (shopkeeper?.email) {
      await sendMail(shopkeeper.email, "New Order Received - Printsaarthi", shopkeeperEmailContent);
    }

    // Also send to Printsaarthi team
    await sendMail("printsaarthi@gmail.com", "New Order", `Customer placed a new order worth ₹${amount}`);

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Start Payment (after order completed)
export const createPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${orderId}`
    };

    const payment = await razorpay.orders.create(options);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's order history
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ customer: userId })
      .populate('shopkeeper', 'name email shopName')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('customer', 'name email')
      .populate('shopkeeper', 'name email shopName');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
