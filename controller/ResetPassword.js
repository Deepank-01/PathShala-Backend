// reset password
// email and password conformation 
// link to the new tag which qould be dynamic in nature 
// password reset 
const User=require("../model/User")
const mailsender = require("../utils/mailsender")
const bcrypt = require('bcrypt');
const crypto=require('crypto')


exports.resetPasswordToken=async(req,res)=>{
    try{
          const{email}=req.body
          const user=await User.findOne({email})
          if(!user){
             return res.status(400).json({
                success:false,
                message:'No user found , incorrect emial id or no user is added in the Db',
            })
          }
          if(user.accountType==="admin"){
             return res.status(200).json({
                success:false,
                message:"Password can't be changed for this account "
             })
          }
      const token= crypto.randomUUID();
      const updateDetails=await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000
      },{new:true})
      console.log("This the updated details",updateDetails)
        //     generating new links
        let link=`http://localhost:5173/update-password/${token}`
        //   sending mails
        const mail=await mailsender(email,"Reset password Link",`Please click on this link ${link} to reset the password`)
        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });

    }
    catch(err){
        return res.json({
            success:false,
            message:'Error in the code of sending the reset link  password to the user',
            error:err.message
        });
    }
}


exports.resetPassword=async(req,res)=>{
    try{
        const{password,token}=req.body
        const user=await User.findOne({token})
        if(!user){
            return res.status(401).json({
               success:false,
               message:'No user found , incorrect emial id or no user is added in the Db',
           })
         }

         if(user.resetPasswordExpires > Date.now()){
            const hashedPassword=await bcrypt.hash(password,10)
            const updatedetails=await User.findOneAndUpdate({token},{password:hashedPassword},{new:true})
            console.log(updatedetails)
            return res.status(200).json({
                success:true,
                message:'Password reset successful',
            });
         }
         else{
            return res.status(400).json({
                success:true,
                message:'Token is expired, please regenerate your token',
            });
         }

    }
    catch(err){
         
        return res.json({
            success:false,
            message:'Error in the code of sending the reset link  password to the user',
        });
    }
}