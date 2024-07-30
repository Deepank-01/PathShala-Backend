const Course=require('../model/Course')
const Category=require('../model/Category')
const {ImageUpload}=require('../utils/ImageUpload')
const User=require('../model/User')
const Section = require('../model/Section')
const Sub_Section = require('../model/Sub_Section')
require('dotenv').config()

// Create the course by instructor 
exports.CreateCourse=async(req,res)=>{
    try{  

      const{courseName,courseDescription,price,whatWillYouLearn,category,instructions,tag}=req.body
      let status=req.body.status
      const user_id=req.user.id
      const thumbnail = req.files.thumbnailImage; // check
      // console.log("course name is ",courseName)
      // validtion on the category
      if (!status || status === undefined) {
        status = "Drafted";
      }

      // check the instructor is present or not 
      const instructorDetails = await User.findById(user_id, {
        accountType: "instructor",
      });

      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        });
      }
      // checking for the category is present 
      const category_info=await Category.findById(category)
      if(!category_info){
        return res.status(400).json({
          message:"Invalid category detected in the Create Course",
          success:false
        })
      }

      // upload the image to cloudnairy
      const thumbnailImage = await ImageUpload(
        thumbnail,
        process.env.FOLDER_NAME
      );
   

        const course_info=await Course.create({ courseName:courseName
                                                 ,courseDescription:courseDescription
                                                 ,price:price
                                                 ,whatWillYouLearn:whatWillYouLearn
                                                 ,category:category
                                                 ,thumbnail:thumbnailImage.secure_url
                                                 ,instructor:user_id
                                                , status:status
                                                 ,tag:tag
                                                 ,instructions:instructions })

        // add the course_info id into the instructor 
        const instructor_info=await User.findByIdAndUpdate(user_id,{$push:{courses:course_info._id}},{new:true})

        // category m course add
        const updateCategory=await Category.findByIdAndUpdate(category,
                                                               {$push:{course:course_info._id}},
                                                               { new: true }

        )

        return res.status(200).json({
          message:'Succesfully created the course',
          success:true,
          course_info,
          instructor_info,
        })
      
    }
    catch(err){
      return res.status(400).json({
        message:'Error in the code of the creating the course',
        success:false,
        error:err.message
        
      })
    
    }
}


// get course details 
exports.GetcourseDetail=async(req,res)=>{
  try{
    const{course_id}=req.body
    const course_details=await Course.findOne({_id:course_id}).populate("instructor").populate("courseContent")
    if(!course_details){
      return res.status(401).json({
        message:"Not able to fetch the course_details",
        success:false
      })
    }
     return res.status(200).json({
      success:true,
      message:"Course details :",
      course:course_details,
  });
  }
  catch(err){
    return res.status(400).json({
      success:true,
      message:"error in the get course",
      error:err.message
  });
  }
}


exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};


exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
exports.getStudentCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const studentId = req.user.id

    // Find all courses belonging to the instructor
    // const instructorCourses = await Course.find({
    //   instructor: studentId,
    // }).sort({ createdAt: -1 })
   const student_Course=await User.findById(studentId).populate("courses")
    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: student_Course.courses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve student courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await Sub_Section.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.Publish=async(req,res)=>{
  try{
   const {courseId}=req.body

   const course_info=await Course.findById(courseId)
   if(course_info.status==="Published"){
    return res.status(200).json({
      success:false,
      message:"Course is already published"
    })
   }
   const updatecourse=await Course.findByIdAndUpdate(courseId,{status:"Published"},{new:true})
   return res.status(200).json({
    success:true,
    message:"Published the course"
   })

  }
  catch(err){
    return res.status(400).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
  
}