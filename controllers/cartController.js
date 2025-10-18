import mongoose from "mongoose"
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

//add item to cart
export const addToCart=async(req,res)=>{
    try{
        const userId= req.user.id  //from auth
        const {productId,quantity}=req.body

        if(!productId || !quantity){
            return res.status(404).json({message:"ProductId and quantity are required"})

        }
        // check if Product exists
        const product = await Product.findById(productId)
        if (!product){
            return res.status(404).json({message:"Product not found"})

        }
        //find users cart
        let cart =await Cart.findOne({user:userId})
        if (!cart){
        cart =new Cart({user:userId, items :[{ product: productId, quantity, price: product.price}]})  //create a new cart
        
        }else{
             const itemIndex=cart.items.findIndex((item)=>item.product.toString()===productId)  ///if product already in cart
       
       
        if (itemIndex > -1){   ///update quantity
            cart.items[itemIndex].quantity+=quantity
        } else{    //add new product to cart
            cart.item.push({product:productId,quantity,price:product.price})
        }
        }
        
        
        await cart.save()
        res.status(200).json ({message:"product added to cart",cart})

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

//update item quantity
export const updateCartitem= async(req,res)=>{
    try{ 
        const userId = req.user.id
        const {productId}=req.params
        const {quantity} =req.body

        let cart =await Cart.findOne({user:userId})
        if(!cart)return res.status(404).json ({message:"cart not found"})

            const itemIndex = cart.items.findIndex(
                (item)=>item.product.toString()===productId
            )

            if(itemIndex === -1){
                return res.status(404).json({message:"no product in cart"})
            }

            if (quantity <= 0){
                //remove item if quatity <= 0
                cart.items.splice(itemIndex ,1)
            }else{cart.items[itemIndex].quantity = quantity

            }
            await cart.save()
            res.status(200).json({message:"cart item updated"})

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Remove item//

export const removeFromCart= async (req,res)=>{
    try{
        const userId = req.user.id
        const {productId}=req.params

        let cart = await Cart.findOne({user:userId})
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items =cart.items.filter(
            (item)=>item.product.toString() !==productId
        )
        await cart.save()
        res.status(200).json({message:"Product removed from cart"})


    }catch(error){
        res.status(500).json({ message: error.message });
    }
}
//clear cart
export const clearCart = async(req,res)=>{
    try{ 
        const userId =  req.user.id
    let cart = await Cart.findOne({user:userId})
     if (!cart) return res.status(404).json({ message: "Cart not found" })
        cart.items = []
    await cart.save()

     res.status(200).json({message:"cart cleared sucessfully"})
}catch(error){
        res.status(500).json({ message: error.message });
         
  }
}
//get cart aggregate
 export const getCart = async (req,res)=>{
    try{
        const userId = new mongoose .Types.ObgectId(req.user.id)

        const cart =await Cart.aggregate([
            {$match:{user:userId}},
            {
                $lookup:{
                from:"products",
                localfield:"items.product",
                foreignfield:"_id",
                as:"productDetails"
            }
        },
        {$unwind:"$items"},
        {$unwind:"productDetails"},

           {
            $match:{
                $expr:{$eq :["$items.product","$productDetails._id"]}
            }
           },

           {
            $addFields: {
                "items.productInfo":"$productDetails",
                "items.itemTotal":{$multiply:["$items.quantity","$items.price"]}
            }
           },
           {
            $group:{
                _id:"$_id",
                user:{$first:"$user"},
                items:{$push:"$items"},
                totalAmount:{$sum:"$items.itemTotal"}
            }
           }

        ])

        if (!cart.length){
              return res.status(404).json({ message: "Cart is empty" });
        }
        res.json(cart[0])
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
 }
