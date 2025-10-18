import Product from "../models/Product.js";
// create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    if (!name || !price || stock === undefined) {
      return res
        .status(400).json({ message: "Name, price and stock are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category_id,
    });

    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all products (with category details via aggregate)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories", // collection name in MongoDB
          localField: "category_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" }, // flatten category array
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single product by ID (with category details via aggregate)
export const getProductById = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { _id: require("mongoose").Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
    ]);

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category_id },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};