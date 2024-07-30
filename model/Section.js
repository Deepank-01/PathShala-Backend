const mongoose= require("mongoose")

const section_schema=new mongoose.Schema({
    sectionName:{
        type:String
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Sub_Section",
            
        }
    ]
})
module.exports=mongoose.model("Section",section_schema)