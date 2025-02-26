const Listing = require("../models/listing.js");
const Reviews = require("../models/reviews.js");


module.exports.createReview = async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    req.flash("success" , "review added");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success" , " Review deleted");
    res.redirect(`/listings/${id}`);
}