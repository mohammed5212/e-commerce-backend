import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
// Create a New Order

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new Order({
      user_id: userId,
      shippingAddress,
      totalAmount,
    });
    await order.save();

    const orderItems = await Promise.all(
      items.map((item) =>
        new OrderItem({
          order_id: order._id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }).save()
      )
    );

    res.status(201).json({
      message: "Order created successfully",
      order,
      orderItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Order By Id (Aggregation)

export const getOrderById = async (req, res) => {
  try {
    const orderId = new mongoose.Types.ObjectId(req.params.id);

    const order = await Order.aggregate([
      { $match: { _id: orderId } },

      // Join user
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Join order items
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "items",
        },
      },

      // Flatten items with product info
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Add category inside product
      {
        $lookup: {
          from: "categories",
          localField: "product.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Build item object
      {
        $addFields: {
          "items.product": {
            name: "$product.name",
            price: "$product.price",
            category: "$category.name",
          },
        },
      },

      // Group back items into array
      {
        $group: {
          _id: "$_id",
          shippingAddress: { $first: "$shippingAddress" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          user: { $first: "$user" },
          items: {
            $push: {
              quantity: "$items.quantity",
              price: "$items.price",
              product: "$items.product",
            },
          },
        },
      },

      // Final shape
      {
        $project: {
          "user.password": 0, // hide sensitive info
        },
      },
    ]);

    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders (Admin)

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      // Join user
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Join items
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "items",
        },
      },
      { $unwind: "$items" },

      // Join products
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Join categories
      {
        $lookup: {
          from: "categories",
          localField: "product.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Build item object
      {
        $addFields: {
          "items.product": {
            name: "$product.name",
            price: "$product.price",
            category: "$category.name",
          },
        },
      },

      // Group per order
      {
        $group: {
          _id: "$_id",
          shippingAddress: { $first: "$shippingAddress" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          user: { $first: "$user" },
          items: {
            $push: {
              quantity: "$items.quantity",
              price: "$items.price",
              product: "$items.product",
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $project: { "user.password": 0 } },
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await OrderItem.deleteMany({ order_id: order._id });
    await order.deleteOne();

    res.json({ message: "Order and its items deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 //get orders of loged-in user//
 export const getUserOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.aggregate([
      { $match: { user_id: userId } },

      // Join order items
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "items",
        },
      },
      { $unwind: "$items" },

      // Join products
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Join categories
      {
        $lookup: {
          from: "categories",
          localField: "product.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Build item with product details
      {
        $addFields: {
          "items.product": {
            name: "$product.name",
            price: "$product.price",
            category: "$category.name",
          },
        },
      },

      // Group back items per order
      {
        $group: {
          _id: "$_id",
          shippingAddress: { $first: "$shippingAddress" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          items: {
            $push: {
              quantity: "$items.quantity",
              price: "$items.price",
              product: "$items.product",
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

