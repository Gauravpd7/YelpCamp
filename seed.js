var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var seeds = [
	{
		name: "Cloud's Rest",
		image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
		description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy."
	},
	{
		name: "Daytona Falls",
		image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
		description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet."
	},
	{
		name: "Desert Mesa",
		image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
		description: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
	}
];

async function seedDB(){
	try{
		await Campground.deleteMany({});
		console.log("Campgrounds Removed");
		await Comment.deleteMany({});
		console.log("Comments Removed");

		for(const seed of seeds){
			let campground = await Campground.create(seed);
			console.log("Campground Created");
			let comment = await Comment.create({
				text: "This place was great, but I wish there was internet",
				author: "Homer"
			});
			console.log("Comment Created");
			campground.comments.push(comment);
			campground.save();
			console.log("Comment added to campground");
		}
	}catch(err){
		console.log(err);
	}
}

module.exports = seedDB;