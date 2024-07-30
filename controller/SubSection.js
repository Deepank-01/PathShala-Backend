// const SubSection=require("../model")
const Section=require("../model/Section")
const SubSection=require("../model/Sub_Section")
const { ImageUpload } = require("../utils/ImageUpload")
require('dotenv').config()

//  create subsction 
exports.createsubsection=async(req,res)=>{
    try{
        const {title, description,sectionId}=req.body
        const video=req.files.video
        // validtion
        if(!title  || !description || !sectionId || !video){
            return res.status(401).json({
                message:"Invalide details in the subsection"
            })
        }
        // cloudnairy upaload the video
           const videoUpload=await ImageUpload(video,process.env.Folder_Name)
           console.log("THis is after the video upload ",videoUpload)
        // create the subtion
        const info=await SubSection.create({
            title:title,
            timeDuration:`${videoUpload.duration}`,
            description:description,
            videoUrl:videoUpload.secure_url
        })
        //    update in the section 

        const update_section=await Section.findByIdAndUpdate(sectionId,{$push:{subSection:info._id}},{new:true}).populate('subSection')
        return    res.status(200).json({
            success:true,
            message:"sub-Section updated successfully",
            data:update_section
        
         })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"Error in the code of the cretion of the subsection",
           error:err.message
         })
    }
}

// update section section and Delet the subsection 

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }

  exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await ImageUpload(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("subSection")


      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }