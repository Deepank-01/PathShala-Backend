const express=require("express")
const router=express.Router()
const{UpdateProfile,getEnrolledCourses, updateDisplayPicture}=require("../controller/Profile")
const {auth, isStudent}=require('../middlewares/auth')

router.put("/updateProfile",auth,UpdateProfile)
router.get("/enrolled-courses",auth,isStudent,getEnrolledCourses)
router.put("/updateProfile",auth,updateDisplayPicture)

module.exports = router