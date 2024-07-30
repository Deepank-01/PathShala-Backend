const express=require("express")
const router=express.Router()

const{CreateCourse,GetcourseDetail,getAllCourses, getInstructorCourses, deleteCourse, Publish, getStudentCourses}=require("../controller/Course")
const{auth,isAdmin,isStudent,isInstructor}=require("../middlewares/auth")
const{CreateSection,deleteSection,updateSection}=require("../controller/Section")
const{createsubsection, deleteSubSection, updateSubSection}=require("../controller/SubSection")
const{ShowAllCategory,crateCategory, categoryPageDetails}=require("../controller/Category")
const{getAllRating,CreateReview}=require("../controller/RatingAndReview")
// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
router.post("/createCourse",auth,isInstructor,CreateCourse)
// create selection 
router.post("/addSection",auth,isInstructor,CreateSection)
// update section
router.post("/updateSection",auth,isInstructor,updateSection)
// delect the section 
router.post("/deleteSection",auth,isInstructor,deleteSection)
// subsection addition
router.post("/addSubSection",auth,isInstructor,createsubsection)
// updation and delection of the subsection left 
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection)
router.post("/updateSubSection",auth,isInstructor,updateSubSection) 
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)
router.delete("/deleteCourse",auth,isInstructor,deleteCourse)
router.put("/publish",auth,isInstructor,Publish)
// for the student course enrolled
router.get("/studentcourse",auth,isStudent,getStudentCourses)


// route  to get all details of the course
router.get("/getAllCourses",getAllCourses)

//route  to get all details of the course 
router.post("/getCourseDetails",GetcourseDetail)



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createCategory",auth,isAdmin,crateCategory)
// show all category
router.get("/showAllCategories",ShowAllCategory)
router.post("/getCategoryPageDetails",categoryPageDetails)


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating",auth,isStudent,CreateReview)
router.post("/getReviews",getAllRating)
module.exports = router