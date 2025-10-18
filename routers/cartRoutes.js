import express from "express"
import { protect } from "../middleware/auth.js"
import { addToCart,
    updateCartitem,
    removeFromCart,
    clearCart,    
    getCart } from "../controllers/cartController.js"
const router =express.Router()

router.get("/",protect,getCart)
router.post("/",protect,addToCart)
router.put("/:productId",protect,updateCartitem)
router.delete("/productId",protect,removeFromCart)
router.delete("/",protect,clearCart)

export default router