const Course=require('../model/Course')
const User =require('../model/User')
const mailsender=require('../utils/mailsender')


const {instance} = require("../config/razarpay");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
// const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
require("dotenv").config()
//initiate the razorpay order
exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
           
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid  = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}


const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try{
            //find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentEnrolled:userId}},
            {new:true},
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false,message:"Course not Found"});
        }

        //find the student and add the course to their list of enrolledCOurses
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
               courses: courseId,
            }},{new:true})
            
        ///bachhe ko mail send kardo
        const emailResponse = await mailsender(
            enrollStudents.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            `congratulations ${enrolledStudent.firstName} you are enrolled in the ${enrolledCourse.courseName} 
            Thank you for choosing us .`
        )    
        //console.log("Email Sent Successfully", emailResponse.response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }

}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailsender(
            enrolledStudent.email,
            `Payment Recieved`,
            //  paymentSuccessEmail(`${enrolledStudent.firstName}`,
            //  amount/100,orderId, paymentId)
            ` Your Payment is successful for the course 
             amount:${amount/100}
             orderId:${orderId}
             paymnetId:${paymentId} `
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}


// // creating the order  for the paymnet
// exports.CapturePayment=async(req,res)=>{
//     try{
//         const{courseid}=req.body
//         const  userid=req.user.id
//         // validtion 
//         if(!courseid){
//             return res.status(400).json({
//                 message:"Improper course id found in the req.body ",
//                 success:false
//             })
//         }
//         // check wheather the course is present multitime
//         var course_info;
//         // for better debugging use the try and catch blocks
//         try{
//              course_info=await Course.findById(courseid)
//              if(!course_info){
//                 return res.status(400).json({
//                     message:"Course not found using the courseid ",
//                     success:false
//                 }) 
//              }
//               let uid=new mongoose.Schema.Types.ObjectId(userid)  
//               if(course_info.studentEnrolled.includes(uid)){
//                 return res.status(401).json({
//                     message:"the course is already present the student account ",
//                     success:false
//                 })
//               }

//         }
//         catch(err){
//             return res.status(400).json({
//                 message:"Error in the course_info code  ",
//                 success:false,
//                 error:err
//             })
            
//         }
//     //    validtion complete , now crete an order
//     const amount=course_info.price
//     const receipt=Math.random(Date.now())
//     const payment_info= await instance.orders.create({
//         amount:amount*100,
//         currency:"INR",
//         receipt:receipt,
//         notes:{
//            course_id:courseid,
//            user_id:userid
//         }
       
//     })
//     console.log(payment_info)

//     return res.status(200).json({
//         message:"Order created succesfully",
//         success:true,
//         orderid:payment_info.id,
//         amount:payment_info.amount,
//         course_name:course_info.cousreName,
//         course_des:course_info.courseDescription
//     })
//     }
//     catch(err){
//         return res.status(400).json({
//             message:"Error occur in the code for the order",
//             success:false,
//             error:err
//         })
//     }
// }


// // Verification of the payment using the web hooks 

// exports.Verification=async(req,res)=>{
//     try{ 
//         const webhookSecret = "12345678";

//         const signature = req.headers["x-razorpay-signature"];
    
//         const shasum =  crypto.createHmac("sha256", webhookSecret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");
//         if(shasum===signature){
//             console.log("Payment is Authorised");
//             const{user_id,course_id}=req.body.payload.payment.entity.notes; // this the route after the razorpay integration 
//             try{
//                 const enrolled_course=await Course.findOneAndUpdate(course_id,{$push:{studentEnrolled:user_id}},{new:true})
//                 if(!enrolled_course) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }
                
//                 //find the student andadd the course to their list enrolled courses me 
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:user_id},
//                                                 {$push:{courses:course_id}},
//                                                 {new:true},
//                               );

//             // sending the email of the response
//             const mail=await mailsender(enrolledStudent.email,"Congratulations from CodeHelp","Congratulations, you are onboarded into new CodeHelp Course")

//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified and COurse Added",
//             });
//             }
//             catch(err){
//                 return res.status(400).json({
//                     success:false,
//                     message:"Error in the code of the email in the verifaction of the code ",
//                 });
//             }
//         }
//         else{
//             return res.status(400).json({
//                 success:false,
//                 message:'Invalid request',
//             });
//         }
//     }
//     catch(err){
//         return res.status(200).json({
//             success:false,
//             message:"Error in the code of the email in the verifaction of the code",
//         });
//     }
// }