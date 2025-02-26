const express = require("express");
const router = express.Router({mergeParams:true});
const User  = require("../models/user");
const wrapAsync = require("../utlis/wrapAsync");
const { route } = require("./listings");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js")

router.get("/signup" , userController.signupForm );

router.post("/signup" , wrapAsync(userController.signup));


router.get("/login" ,userController.loginForm);

router.post("/login" ,saveRedirectUrl,
            passport.authenticate("local",{failureRedirect:"/login" , failureFlash:true}), 
            userController.login);


router.get("/logout" ,userController.logout);



module.exports = router;