const Section =require('../model/Section')
const Course=require('../model/Course')
const Sub_Section = require('../model/Sub_Section')
// create section 
 exports.CreateSection =async(req,res)=>{
    try{
        const{sectionName,courseId}=req.body
    if(!sectionName || !courseId){
        return res.status(401).json({
            message:"Invalide details in the section creation please agin mention the section name and the coureseID"
        })
    }
    // creation of section
    const info=await Section.create({sectionName})
    console.log("Section crated ",info)
    const course_info=await Course.findById(courseId)  // Course.finsById({_id:courseId})
    // add the id of the section in the course
    const update_course=await Course.findByIdAndUpdate(courseId,{$push:{courseContent:info._id}},{new:true}).populate({
        path: "courseContent",
        populate: {
            path: "subSection",
        },
    })

    // console.log(update_course)
     return res.status(200).json({
        success:true,
        message:"created successfully",
        updatedCourse:update_course
     })

    }
    catch(err){
        res.status(401).json({
            success:false,
            message:"Not created successfully in the createsection",
            error:err.message
         })   
    }

}

// update section
exports.updateSection=async(req,res)=>{
    try{
        const {sectionId,sectionName,courseId}=req.body
        if(!sectionName || !sectionId){
            return res.status(401).json({
                message:"Invalide details in the section creation please agin mention the section name and the sectionID"
            })
        }

        // update the name of the section
        const info=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        
		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        return res.status(200).json({
            success:true,
            message: info,
			data:course,
        
         })
    

    }
    catch(err){
        res.status(401).json({
            success:false,
            message:"Not created successfully in the createsection",
            error:err
         })

    }
}

// delete section 
exports.deleteSection=async(req,res)=>{
    try {

		const { sectionId, courseId }  = req.body;

		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await Sub_Section.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	}
    catch(err){
        res.status(401).json({
            success:false,
            message:"Unable to delete the section ",
            error:err
         })

    }
}