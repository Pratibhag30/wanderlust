const passport = require("passport");
const Listing = require("./models/listing");
const Review = require("./models/reviews");


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "login is required");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have permission to do");
         return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id  , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have permission to do because you are not the author");
         return res.redirect(`/listings/${id}`);
    }
    next();
}