//creates models


const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");

let listSchema = new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
       url:String,
       filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews :[
        {
        type : Schema.Types.ObjectId,
        ref:"Review"
        }
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref :"User"
    },
    category :{
        type : String,
        enum: ["Trending","Farms","Rooms","Arctic","beach","Iconic cities","mountains","Amazing pool","Camping"]
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});


listSchema.post("findOneAndDelete" , async (listing)=>{
   if(listing){
      await Review.deleteMany({_id :{$in : listing.reviews}})
   }
});


const Listing = mongoose.model("Listing" , listSchema);

module.exports = Listing;