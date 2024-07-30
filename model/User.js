const mongoose=require("mongoose")
const user_schema= new mongoose.Schema({
firstName:{
    type:String,
    required:true,
    trim:true
},
lastName:{
 type:String,
 trim:true
},
password:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
accountType:{
    type:String,
    required:true,
    lowercase:true,
    enum:["admin","student","instructor"]
},
additionalDetails:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Profile",
    required:true
},
courses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
}], 
courseProgress:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"CourseProgress"
}],
 
image:{
    type:String,
},
token:{
    type:String
},
resetPasswordExpires: {
    type:Date,
}

})

module.exports=mongoose.model("User",user_schema)