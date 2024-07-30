// auth and authz
// checkng the auth
var jwt = require('jsonwebtoken');
require("dotenv").config()

exports.auth=async(req,res,next)=>{
try{

const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")
console.log("This is the token ",token)
if(!token) {
    return res.status(401).json({
        success:false,
        message:'TOken is missing',
    });
}

// check the token
try{
    const payload =  jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload;
}
catch(err) {
    //verification - issue
    return res.status(401).json({
        success:false,
        message:'token is invalid',
    });
} 
next()
}
catch(err){
    return res.status(401).json({
        success:false,
        message:'Something went wrong while validating the token',
        error:err
    });
}

}

// checking for the students
exports.isStudent=async(req,res,next)=>{
 try{
     const role=req.user.role
     if(role!=="student"){
       return  res.status(200).json({
            success:false,
            message:'Not have access to the student ',
        })
     }
     next()
 }
 catch(err){
     res.status(400).json({
        success:false,
        message:'Error  in the code of the is student',
        error:err
    })
 }   
}

exports.isAdmin=async(req,res,next)=>{
    try{
        const role=req.user.role
        if(role!=="admin"){
          return  res.status(200).json({
               success:false,
               message:'Not have access to Admin',
           })
        }
        next()
    }
    catch(err){
        res.status(400).json({
           success:false,
           message:'Error  in the code of the is Admin',
           error:err
       })
    }   
   }

   exports.isInstructor=async(req,res,next)=>{
    try{
        const role=req.user.role
        if(role!=="instructor"){
          return  res.status(200).json({
               success:false,
               message:'Not have access to instructor',
           })
        }
        next()
    }
    catch(err){
        res.status(400).json({
           success:false,
           message:'Error  in the code of the is instructor',
           error:err
       })
    }   
   }