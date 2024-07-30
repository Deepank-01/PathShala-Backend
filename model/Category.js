const mongoose=require("mongoose")

const tag_schema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type:String,
    },
   course:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
   }]
})
module.exports=mongoose.model("Category",tag_schema)