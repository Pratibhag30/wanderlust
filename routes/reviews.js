const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");
const { reviewSchema} =  require("../schema.js");
const Reviews = require("../models/reviews.js");
const {isloggedin,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js")


//validate review from server side
const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>error.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}


//Reviews
//post route for reviews
router.post("/" , isloggedin,validatereview, wrapAsync(reviewController.createReview));

//delete route for reviews
router.delete("/:reviewId" ,isloggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;