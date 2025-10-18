import User from "../models/User.js"

import bcrypt from "bcrypt"

//get all users
export const getAllUsers =async (req,res)=>{
    try{
        const users =await User .find().select("-password")
        res.json(users)
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
///get user by id (admin only)

export const getUserById = async(req,res)=>{
   try{
    const {id}= req.params

    //admin can view any user, normal users only their profile
    if (req.user.role !=="admin" && req.user.id !==id){
         return res.status(403).json({ message: "Not authorized to view this user" });
    }
    const user = await User.findById(id).select("-password")
    if(!user) return res.status(404).json({ message: "User not found" });
    
      res.status(200).json({ user });
   }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//update user (admin/user)
 export const updateUser = async(req,res)=>{
    try{   
        const {id}=req.params
    if(req.user.role !=="admin" &&req.user.id !==id){
        return res.status(403).json({message:"not authorized for update this user"})
    }
    const {username,email,password}=req.body
    const updateFields= {}
    if (username) updateFields.username= username
    if (email) updateFields.email=email
    if (password) {
        const salt= await bcrypt.genSalt(10)
        updateFields.password =await bcrypt.hash(password, salt)
    }
    const updateUser =await User.findByIdAndUpdate(id , {$set:updateFields },{new:true,runValidators:true}).select("-password")
    if(!updateUser)return res.status(404).json({message:"User not found"})

        res.json({message:"User updated successfully",user:updateUser})

}catch (error) {
    res.status(500).json({ message: error.message });
  }
 
}

//delete user (admin only)
export const deleteUser = async (req,res)=>{
    try{
        const {id}=req.params
        if (req.user.role !=="admin"){
            return res.status(403).json({message:"only admin can delete user"})
        }
        const user = await User.findByIdAndDelete(id)
        if(!user)return res.status(404).json({message:"user not found"})

            res.json({message:"User deleted successfully"})

    }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//get own profile
export const getProfile =async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password")
        if (!user)return res.status(404).json("user not found")

            res.json(user)

    }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//update own profile
export const updateProfile =async(req,res)=>{
    try{ const {username,email,password}=req.body
    const updateFields={}
    if(username) updateFields.username=username
    if(email)updateFields.email=email
    if(password){
        const salt=await bcrypt.genSalt(10)
        updateFields.password=await bcrypt.hash(password,bcrypt.salt)
    }
    const updatedUser =await User.findByIdAndUpdate(req.user.id,updateFields,{new:true}).select("-password")

    res.json({message:"Profile updated successfully",user: updatedUser})
}catch (error) {
    res.status(500).json({ message: error.message });
  }
   
}
