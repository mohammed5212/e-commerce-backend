import Order from "../models/Order.js"
//initiate payment

//demo

export const initiatePayment =async (req,res)=>{
    try{
        const userId =req.user.id
        const {orderId,paymentMethod}=req.body

        //validate
        if(!orderId  || paymentMethod){
            return res.status(400).json({message:"orderId and paymentMethod required"})
        }
        //find order
        const order =await Order.findOne({_id:orderId,user_id:userId})
        if (!order){
               return res.status(404).json({ message: "Order not found" });
        }

        ///mock payment process

        //In real-world → use Stripe/PayPal SDK here
        const mockPaymentId ="PAY_"+Date.now()

        //update order status
        order.status = "paid"
        order.paymentInfo ={
            method:paymentMethod,
            paymentId:mockPaymentId,
            paidAt:new Date()
        }
        await order .save()
          res.status(200).json({ message: "Payment successful", order
    });
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//get  payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      orderId: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentInfo: order.paymentInfo || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

