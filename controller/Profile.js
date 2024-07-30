const Profile=require('../model/Profile')
const User=require('../model/User')
const { ImageUpload } = require('../utils/ImageUpload')

exports.UpdateProfile=async(req,res)=>{
    try{
        // input from the body
        const{contactNumber,about="",dateofBirth=""}=req.body
        const userid=req.user.id
        // console.log("This the id of the user : ",req.user.id)
        // verfiy
        if(!userid){
            return res.status(400).json({
                message:"Invlaid id in the update profile"
            })
        }

        const user_info=await User.findById(userid)
        // console.log("The user info is : ",user_info)
        const profile_id=user_info.additionalDetails
        // update the values using the save method this time
        const profile_info=await Profile.findById(profile_id)
        // profile_info.gender=gender
        profile_info.contactNumber=contactNumber
        profile_info.about=about
        profile_info.dateofBirth=dateofBirth
        await profile_info.save()
        return res.status(400).json({
            message:"Succesfully Updated the Profile",
            success:true,
            profile:profile_info
        })

    }
    catch(err){
        res.status(401).json({
            message:"Error in the updating the profile",
            error:err
        })
    }
}
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

// Delect profile 
// update profile picture

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await ImageUpload(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    // console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};
