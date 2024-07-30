const mongoose= require("mongoose")

const subsection_schema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
    },
    timeDuration:{
              type:String
    },
    description:{
        type:String,
        trim:true
    },
    videoUrl:{
        type:String
    }
})
module.exports = mongoose.model("Sub_Section", subsection_schema);