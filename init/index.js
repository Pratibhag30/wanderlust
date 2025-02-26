//intialize the database
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");


main() 
.then((res)=>{
    console.log("successfully connected");
})
.catch((err)=>{
    console.log("error");
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

let initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:'67b7fcd7834bbae7390c0c0b'}));
    initdata.data = initdata.data.map((obj)=>({...obj, category:"Trending"}));
   await Listing.insertMany(initdata.data);
    console.log("saved");
}

initDB();