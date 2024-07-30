const mongoose= require("mongoose")

const rating_schema=new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   rating:{
    type:Number,
    required:true
   },
   review:{
    type:String,
    required:true,
    trim:true
   },
   course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},

})
module.exports=mongoose.model("RatingAndReview",rating_schema)