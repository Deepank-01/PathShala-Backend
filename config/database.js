const mongoose=require("mongoose")
require("dotenv").config()
const dbconnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
          useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{console.log("Db connected Suucessfully ")})
    .catch((err)=>{console.log("Error in the conncetion with the DB  , error :",err)
        process.exit(1);
    })
}
module.exports=dbconnect