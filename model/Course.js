const mongoose= require("mongoose")

const course_schema=new mongoose.Schema({
  courseName:{
    type:String,
    required:true
  },
  courseDescription:{
    type:String,
    trim:true,
  },
  instructor:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },
  whatWillYouLearn:{
    type:String,
    trim:true
  },
  courseContent:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }
  ],

  ratingAndReviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview"
  }],

  price:{
    type:Number
  },

  thumbnail:{
    type:String
  },

 category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
  tag: {
		type: String,
		required: true,
	},

  studentEnrolled:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }],
  instructions: {
		type: String,
	},
  status: {
		type: String,
		enum: ["Drafted", "Published"],
	},
})
module.exports=mongoose.model("Course",course_schema)