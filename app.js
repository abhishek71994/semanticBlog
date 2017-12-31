var express = require('express'),
bodyParser  = require('body-parser'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer'),
mongoose	= require('mongoose'),
	app 	= express();

//initial configuration
mongoose.connect("mongodb://localhost/blog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());//the only requirement is that it goes after the bodyParser
app.use(methodOverride("_method"));

//database configuration
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);
// title
// image
// body
// created

//creating a test input
// Blog.create({
// 	title:"Test blog",
// 	image:"https://cdn.vox-cdn.com/uploads/chorus_asset/file/8711975/mma-1000.0.png",
// 	body:"The serenity of the nature is very pleasing to the eyes"
// });

//RESTful routes
app.get("/",function(req,res){
	res.redirect("/blogs");
})
//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//create route
app.post("/blogs",function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	})
	//redirect to index
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error!");
		}
		else{
			res.render("index",{blogs:blogs});			
		}
	})

})
//show routes
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
	//find the blog using the id
	Blog.findById(req.params.id,function(err,oneBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:oneBlog});
		}
	});
	
});
//update route
app.put("/blogs/:id",function(req,res){
	// //find the blog using the id
	// Blog.findById(req.params.id,function(err,oneBlog){
	// 	if(err){
	// 		res.redirect("/blogs");
	// 	}
	// 	else{
	// 		//update the query here maybe
	// 		res.render("edit",{blog:oneBlog});
	// 	}
	// });
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//new type
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
			if(err){
				res.redirect("/blogs");
			}
			else{
				res.redirect("/blogs/"+req.params.id);
			}
	});
});
//delete route
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
});
app.listen(process.env.PORT || 3001,function(){
	console.log("server is running!")
})