const RatingAndReview= require('../model/RatingAndReview')
const User=require("../model/User")
const Course=require("../model/Course")

// create review

exports.CreateReview=async(req,res)=>{
try{
    const user_id=req.user.id
    const{course_id, review,rating}=req.body
    // validtion that is student is enrolled in the course
      const enrolledstudent=await Course.findOne({_id:course_id,studentEnrolled:{$elemMatch :{$eq: user_id}}})
      if(!enrolledstudent){
         return res.status(400).json({
            success:false,
            message:'Studend is not errolled in the course',
        });
      }
    //   validation for the checking that student already enrolled in the course or not 
    const israting=await RatingAndReview.findOne({user:user_id,course:course_id})
    if(israting){
        return res.status(400).json({
            success:false,
            message:'Already return the rating',
        });
    }
    const update_rating=await RatingAndReview.create({user:user_id,rating:rating,review:review,course:course_id})
    return res.status(200).json({
        success:true,
        message:'Updated the rating succesfully',
        update_rating
    });
}
catch(err){
    return res.status(400).json({
        success:false,
        message:'Error in the code of the Create_review',
        error:err
    });
}
}

// get all rating 
exports.getAllRating=async(rq,res)=>{
    try{
        const review_info=await RatingAndReview.find().sort({rating:"desc"}).populate("user").populate("course")
        return res.status(200).json({
            success:true,
            message:'All the reviews are ',
            review_info
        });


    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:'Invalid code of the get all rating ',
        });
    }
}