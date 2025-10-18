import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user_id : {type:mongoose.Schema.Types.ObjectId,ref: "User",required:true},
    
},{tymestamps:true})
export default mongoose.model("Cart",cartSchema)