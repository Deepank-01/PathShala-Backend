const express=require("express")
const router=express.Router()

const{capturePayment,verifyPayment,sendPaymentSuccessEmail}=require("../controller/Payment")
const{auth,isAdmin,isStudent,isInstructor}=require("../middlewares/auth")

router.post("/capturePayment",auth,isStudent,capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);
module.exports = router
