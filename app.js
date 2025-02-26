if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const { title } = require("process");
const ejsMate= require("ejs-mate");
const { listingSchema , reviewSchema} =  require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash  = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js")


app.set("view engine" , "ejs");
// console.log("Views directory path:", path.join(__dirname, 'views'));
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));


const dbUrl = process.env.ATLAS_URL;

main() 
.then((res)=>{
    console.log("successfully connected");
})
.catch((err)=>{
    console.log("error");
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{secret: process.env.SECRET},
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("error in mongo session",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true
    }
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/demouser" , async (req,res)=>{
    let fakeuser = new User({
        email:"abc@gmail.com",
        username: "abc"
    })

 const registereduser = await User.register(fakeuser , "hello");
  res.send(registereduser)
})

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" ,userRouter);



//error handling middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(402,"page not found"));
})
app.use((err,req,res,next)=>{
    let{status=500,message} = err;
   res.render("listings/error.ejs" ,{message});
})


app.listen("8080" , ()=>{
    console.log("listening to port 8080");
})