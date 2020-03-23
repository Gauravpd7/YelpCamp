var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//Root Route
router.get("/",(req,res)=>{
	res.render("landing");
});

//show register form
router.get("/register",(req,res)=>{
	res.render("register");
});
//handle signup logic
router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds");
		});
	});
});
//login
router.get("/login",(req,res)=>{
	res.render("login");
});
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),(req,res)=>{
	
});
//logout route
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged You Out!");
	res.redirect("/campgrounds");
});

module.exports = router;