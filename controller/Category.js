const Category=require('../model/Category')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.crateCategory=async(req,res)=>{
    try{
        const{name, description}=req.body
        if(!name){
            return res.status(401).json({
                message:"Incomplete details of the name and the description",
            })
        }
        const info=await Category.create({name,description})
        console.log(info)
        res.status(401).json({
            message:"Succesfully inserted the tags in the Db",
            success:true
        })
    }
    catch(err){
        res.status(401).json({
            message:"Error in the code during the creation of the tags",
            error:err
        })
    }
}

// get all tags 
exports.ShowAllCategory=async(req,res)=>{
    try{
        
        const info=await Category.find({},{name:true,description:true})  // find({},{name:true,description:true}) is would show the only the name , desrcription and id 
        // console.log(info)
        res.status(200).json({
            message:"Succesfully got the tags of the Db",
            success:true,
            category:info
        })
    }
    catch(err){
        res.status(401).json({
            message:"Error in the code during the getting  of the tags",
            error:err
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      // console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "course", 
          match: { status: "Published" },
        //   populate: " ratingAndReviews",
        })
        .exec()

  
    //   console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categoriess
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
    //   const allCategories = await Category.find()
    //     .populate({
    //       path: "course",
    //       match: { status: "Published" },
    //       populate: {
    //         path: "instructor",
    //     },
    //     })
    //     .exec()
    //   const allCourses = allCategories.flatMap((category) => category.course)
    //   const mostSellingCourses = allCourses
    //     .sort((a, b) => b.sold - a.sold)
    //     .slice(0, 10)
    //    // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
