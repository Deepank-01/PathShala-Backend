const express=require("express")
const router=express.Router()

const{SendOtp,SignIn,login,changepassword}=require("../controller/Auth")
const{auth}=require("../middlewares/auth")
const{resetPassword,resetPasswordToken}=require("../controller/ResetPassword")
// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login",login)
// Route for user signup
router.post("/signup", SignIn)

// Route for sending OTP to the user's email
router.post("/sendotp", SendOtp)
router.post("/changepassword",auth,changepassword)


// Reset password 
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

module.exports = router


