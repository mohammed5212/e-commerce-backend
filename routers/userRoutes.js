import express from "express"
const router= express.Router()
import { protect, 
    authorize } from "../middleware/auth.js"
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getProfile,
     updateProfile } from "../controllers/userController.js"  

// User self profile 
router.get("/me/profile", protect, getProfile);
router.put("/me/profile", protect, updateProfile);

// Admin only
router.get("/", protect, authorize("admin"), getAllUsers);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Admin and self
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);


export default router