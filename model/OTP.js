const mongoose=require("mongoose")
const mailsender = require("../utils/mailsender")

const otp_schema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
     type:Date,
     default:Date.now,
     expires: 300   
    }
})


// code for the otp sending to the mail
async function sendverification(email,otp){
    try{
        const mailresponse=await mailsender(email,"Verification Email from the study quants",otp)
        console.log("This the response of the mail ", mailresponse)
    }
    catch(err){
        console.log(err)
    }

}

otp_schema.pre("save",async function(next){
      await sendverification(this.email,this.otp)
      next()
})
module.exports=mongoose.model("OTP",otp_schema) 