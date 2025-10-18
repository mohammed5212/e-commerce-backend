import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user_id :{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        type: {type:String, enum:["home","work","other"],default:"home"},
        street:String,
        city: String,
        state:String,
        country:String,
       phone: String,

    },{tymestamps:true}
)
export default mongoose.model("Address",addressSchema)