import Category from "../models/Category.js";

//  Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // check duplicate
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Error creating category", error: error.message });
  }
};

//  Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating category", error: error.message });
  }
};

//  Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

