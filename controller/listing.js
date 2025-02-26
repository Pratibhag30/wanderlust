const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allList = await Listing.find();
    res.render("listings/index.ejs" , { allList });
};

module.exports.showcategory =  async(req,res)=>{
    const allList = await Listing.find();
    let {category} = req.query;
    let list = await Listing.find({category:`${category}`});
    if(list.length != 0){
        res.render("listings/index.ejs", { allList:list});
    }else {
       res.render("listings/noList.ejs");
    }
    
}


module.exports.showlocation = async (req,res)=>{
    const searchQuery = req.query.q;
    const results = await Listing.find({
        $or: [
            { location: { $regex: new RegExp(searchQuery, "i") } },
            { country: { $regex: new RegExp(searchQuery, "i") } }
        ]
    });
    if(results.length!=0){
        res.render("listings/index.ejs", {allList : results});
    }else{
        res.render("listings/noList.ejs");
    }
    
}


module.exports.destroyList = async (req,res)=>{
    let { id }= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , " listing deleted");
    res.redirect("/listings");
};

module.exports.showUpadateForm =async (req,res)=>{
    let { id }= req.params;
   let listing = await Listing.findById(id);

   let originalImageUrl = listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload" , "/upload/w_250")
    res.render("listings/edit.ejs",{listing , originalImageUrl});
}

module.exports.updateList = async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
     
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success" , "listing upadated");
    res.redirect(`/listings/${id}`);
}

module.exports.createListForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createList = async (req,res,next)=>{
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let {category} = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newlist = new Listing(req.body.listing);
    newlist.owner = req.user._id;
    newlist.image = {url,filename};
    newlist.category = category;
    newlist.geometry = response.body.features[0].geometry
    let savelist = await newlist.save();
    req.flash("success" , "New listing created");
    res.redirect("/listings");
}

module.exports.showList = async (req,res)=>{
    let { id }= req.params;
    let data = await Listing.findById(id).populate({path:"reviews" ,populate:{path:"author"}}).populate("owner");
    if(!data){
     req.flash("error" ,"listing that you want is not exist");
     res.redirect("/listings")
    }
    res.render("listings/show.ejs",{ data });
 }