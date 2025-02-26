const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const { listingSchema } =  require("../schema.js");
const Listing = require("../models/listing.js")
const {isloggedin,isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


//validate schema from server side
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>error.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}


//index route  - where all the list are available
router.get("/" , wrapAsync(listingController.index));

router.get("/location" , wrapAsync(listingController.showlocation));

//show category listing route
router.get("/category", wrapAsync(listingController.showcategory));

//ADD NEW LISTING   
router.post("/" , isloggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createList));

//create route for form that add new listings
router.get("/new", isloggedin,listingController.createListForm)

//delete route
router.delete("/:id" , isloggedin,isOwner, wrapAsync(listingController.destroyList));


//update route form
router.get("/:id/edit" , isloggedin,isOwner,wrapAsync(listingController.showUpadateForm));

//update route
router.put("/:id", isloggedin,isOwner,upload.single("listing[image]"),validateListing , wrapAsync(listingController.updateList));


//show route - where all detailed info is showing
router.get("/:id", wrapAsync(listingController.showList));


module.exports = router;