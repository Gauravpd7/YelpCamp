var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//Comments New
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: foundCampground});	
		}
	});
});
//Comments Create
router.post("/",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					console.log(err);
					req.flash("error","Something went wrong");
				}else{
					//add username and id to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success","Successfully added comment");	 
					res.redirect("/campgrounds/"+foundCampground._id);
				}
			});
		}
	});
});
//Comments Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				res.redirect("back");	
			}else{	
				res.render("comments/edit",{campground: foundCampground, comment: foundComment});	
			}		
		});		
	});
});
//Comments Update
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//Comments Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect("back");
		}else{
			console.log("Comment Deleted");
			req.flash("success","Comment successfully deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

module.exports = router;