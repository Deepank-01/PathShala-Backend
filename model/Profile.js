const mongoose=require("mongoose")

const profile_schema= new mongoose.Schema({
    gender:{
        type:String
    },
    dateofBirth:{
        type:String
    },
    about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true
    }
})

module.exports= mongoose.model("Profile",profile_schema)