const nodemailer=require('nodemailer')
require('dotenv').config()
const mailsender=async(email,title,body)=>{
    try{
    //   build a transporter
    let transporter=nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
           user:process.env.MAIL_USER,
           pass:process.env.MAIL_PASS
        }
    })

    // send mail  to the revier 
    let info=await transporter.sendMail({
        from:"Study quants",
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })

    console.log(info)
    return info
    }
    catch(err){
       console.log("The error occur in the nodemailer", err)
    }
}
module.exports=mailsender