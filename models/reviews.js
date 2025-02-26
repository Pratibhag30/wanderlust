const mongoose = require("mongoose");
let Schema =  mongoose.Schema;

let reviewSchema = new Schema({
    comment : String,
    rating :{
        type:String,
        min:0,
        max:1
    },
    createdAt :{
        type:Date,
        default : Date.now()
    },
    author :{
        type: Schema.Types.ObjectId,
        ref : "User"
    }
});

const Review = mongoose.model("Review" , reviewSchema);

module.exports = Review;