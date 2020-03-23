var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var  middleware = require('../middleware');
//INDEX - Shows all campgrounds
router.get("/",(req,res)=>{
	Campground.find({},(err,campgrounds)=>{
		if(err){
			console.log("ERROR!!");
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds: campgrounds});
		}
	});
});

//CREATE - Adds new campground
router.post("/",middleware.isLoggedIn,(req,res)=>{
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground,(err,campground)=>{
		if(err){
			console.log(err);
		} else {
			console.log("New Campground Added!");
			res.redirect("/campgrounds");
		}
	});
});

//NEW - Displays the form to add a new campground
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new.ejs");
});
//SHOW - Shows more info about one campground
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
		if(err || !foundCampground){
			console.log(err);
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});
//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		res.render("campgrounds/edit",{campground: foundCampground});
	});


});

//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Campground successfully updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			console.log("Campground Deleted");
			req.flash("success","Campground successfully removed");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;