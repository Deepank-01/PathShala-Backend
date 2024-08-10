const express=require("express")
const router=express.Router()
const{UpdateProfile,getEnrolledCourses, updateDisplayPicture, instructorDashboard}=require("../controller/Profile")
const {auth, isStudent, isInstructor}=require('../middlewares/auth')

router.put("/updateProfile",auth,UpdateProfile)
router.get("/enrolled-courses",auth,isStudent,getEnrolledCourses)
router.put("/updateProfile",auth,updateDisplayPicture)
router.get("/dashboardStats",auth,isInstructor,instructorDashboard)

module.exports = router