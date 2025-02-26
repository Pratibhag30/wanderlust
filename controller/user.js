const User = require("../models/user");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try{
        let {email , username , password} = req.body;
        const newUser  = new User({email,username});
        const registereduser = await User.register(newUser , password);
        req.login(registereduser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to WanderLust");
            return res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error", e.message);
        return res.redirect("/signup");
    }

}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success" , "back to wnaderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success" ,"you were logout now");
            res.redirect("/listings");
        }
    })
}