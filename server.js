const express=require("express")
const app= express()
const database=require("./config/database")
const {cloudinaryConnect}=require("./config/Cloudinary")
require('dotenv').config()
var cookieparser=require("cookie-parser")
const fileUpload=require("express-fileupload")
var cors = require('cors')
const userRoutes=require('./routes/User')
const profileRoutes=require("./routes/Profile")
const courseRoutes=require('./routes/Course')
const paytmentRoutes=require('./routes/Payment')
// middle wares 
app.use(express.json())
app.use(cookieparser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors())

// Mounting the routers
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/payment',paytmentRoutes)

// connection with db  and cloudianry
cloudinaryConnect()
database()
// connection with the port 
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{  
    console.log("Server Started successful on PORT",PORT)
    
})

// default route
app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"Welcome to the study notion Pathsala backend Servers"
    })
})