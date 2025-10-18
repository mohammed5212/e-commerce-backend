import express from "express"
const router = express.Router()
import { protect,
     authorize } from "../middleware/auth.js  "
import {
    getAllProducts,
    getProductById,createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

///public routes///
router.get("/",getAllProducts)        ///get all products
 router.get("/:id",getProductById)    ///get single product by id

///proected routes (admin only)

 router.post("/",protect,authorize("admin"),createProduct)     ///create product
 router.put("/:id",protect,authorize("admin"),updateProduct)     //update product
 router.delete("/:id",protect,authorize("admin"),deleteProduct)   //delete product

export default router