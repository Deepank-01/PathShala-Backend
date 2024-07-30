const OTP=require("../model/OTP")
const User=require("../model/User")
const Profile=require("../model/Profile")
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailsender = require("../utils/mailsender");
// var Cookies = require('cookies')
require("dotenv").config()
// otp send to the user 
exports.SendOtp=async(req,res)=>{
    try{
    const{email}=req.body
    // check wheater the request is in the db or not 
    const isemail=await User.findOne({email})
    if(isemail){
        return res.status(200).json({
            message:" The emial alrready exits",
            success:false
        })
    }
     // generate otp
   var otp= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
//    console.log("This is the otp generate :",otp)
//    check for the unqiue otp
var is_otp=await OTP.findOne({otp:otp})
// generate otp again and again till the otp is uqniue
while(is_otp){
    otp= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
    is_otp=await OTP.findOne({otp:otp})  
}
const final_obj={email,otp}
const final_otp_value=await OTP.create(final_obj)
// console.log("The final otp object in the db is ",final_otp_value)
 res.status(200).json({
    success:true,
    message:"OTP send succesfully"
 })

}
catch(err){
    res.status(400).json({
        state:false,
        message:"Error in the code of the sendotp in the auth controller",
        error:err
    })
}
}

// sign in logic

exports.SignIn=async(req,res)=>{
    try{
         
        const{firstName,
         lastName,
         email,
         password,
         accountType,
         otp}=req.body
        //  valid this all 
        if( !firstName|| !email || !password || !accountType || !otp ){
            return res.status(200).json({
                message:"Iincomplete information plese provied the impformation in the response",
                status:"Unscessuful, provide the complete information",
                success:false
            })
        }

        //  validtion on the email
        const isemail=await User.findOne({email})
        if(isemail){
            return res.status(200).json({
                message:" The emial alrready exits",
                success:false
            })
        }
        // checking for the otp validtion 
        const otp_value =await OTP.findOne({email})
        if(!otp_value){
            return res.status(200).json({
                message:" The otp does not exits",
                success:false
            })
        }


        //   checking for the otp matching  and entering  into the DB
        const recentOtp = await OTP.findOne({email});
        // console.log(recentOtp)
        if(otp!== recentOtp.otp){
            return res.status(200).json({
                success:false,
                message:"Invalid OTP",
                Db_otp:recentOtp.otp,
            })
        }
 
        //  password hashing 
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("The password hashed successfully ", hashedPassword)
        //  creating the empty profile
             const profile=await Profile.create({
                gender:null,
                dateofBirth:null,
                about:null,
                contactNumber:null
             });
            //  console.log("The profile is created ",profile)
            
            //  entering the data into the DB of the User
            const obj={
                firstName,
                lastName,
                password:hashedPassword,
               email,
               accountType,
               additionalDetails:profile._id,
              image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`  
            }

            // console.log("The obj is created  : ")

            const info=await User.create(obj)
            // console.log("The user is created  : ",info)
            res.status(200).json({
                message:"Created the entire of the user in the DB",
                success:true,
                information:info
            })
    } 
    catch(err){
        res.status(400).json({
            message:"Error the creating the element the User DB",
            status:false,
            error:err
        })
    }

}


// login logic 

exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body
        // console.log("Email of the login is :",email)
        // console.log("The password for the loginf is : ",password)

        if(!email || !password){
            return res.status(200).json({
                email:email,
                password:password,
                message:"incomplete information plese provied the impformation in the response",
                status:"Unscessuful, provide the complete information",
                success:false
            })
        }
        // check email present in the user
        const user=await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(400).json({
                message:"User not found in the DB",
                success:false
            })
        }
        // console.log("The password of the user ", user)
        // checking the password
        const is_pass=await bcrypt.compare(password,user.password)
        
           if(is_pass){
            // password matched , now use the jwt token
            // console.log("Inside the if statement :",is_pass)
            payload={
                email:user.email,
                id:user._id,
                role:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"})
            // user=user.toObject()
            user.password=null
            user.token=token
           
            option={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,

            }
            
            res.cookie("token",token,option).status(200).json({
                message:"Succesfully login the user",
                success:true,
                user,
                token,
            })

           }
           else{
            return res.status(400).json({
                message:"Incorrect password please try again",
                status:false
            })
           }
    }
    catch(err){
        res.status(503).json({
            message:"Error occur in the code of the login",
            status:false,
            error:err
        })
        
    }

}

// change password
// exports.changepassword=async(req,res)=>{
//     try{
//         const{email,password,newpassword}=req.body
//         if(!email || !password || !newpassword){
//             return res.status(401).json({
//                 message:"incomplete information plese provied the impformation in the response",
//                 status:"Unscessuful, provide the complete information"
//             })
//         }
//         const user=await User.findOne({email})
//         if(!user){
//             return res.status(400).json({
//                 message:"User not found in the DB",
//                 status:false
//             })
//         }
//         const is_pass=await bcrypt.compare(password,user.password)
//         if(is_pass){
//             // encrytp the passwaord
//             const hashedPassword=await bcrypt.hash(newpassword,10)
//             const update_info=await User.updateOne({email},{$set :{password:hashedPassword}})
//             // sending the mail
//             const mail= await mailsender(user.email,"Change password","Succesfully change the password ")
//             res.status(200).json({
//                 message:"Successfully changed the password",
//                 update_info,
//             })
        

//         }
//         else{
//              res.status(401).json({
//                 message:"Incorrect password , Please check again",
                
//             })
//         }


//     }
//     catch(err){
//         res.status(400).json({
//             message:"Error in the changing the pasword ",
//             error:err
            
//         })
//     }
// }
exports.changepassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailsender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			// console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};