import express from "express" 
import { protect } from "../middleware/auth.js"
const router = express.Router();

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js" 

// Routes
router.get("/",protect, getCategories);       // GET all categories
router.post("/",protect , createCategory);     // POST new category
router.put("/:id", protect ,updateCategory);   // PUT update category
router.delete("/:id", protect ,deleteCategory);// DELETE category

export default router;