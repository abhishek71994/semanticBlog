var express = require('express'),
bodyParser  = require('body-parser'),
mongoose	= require('mongoose'),
	app 	= express();

//initial configuration
mongoose.connect("mongodb://localhost/blog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

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
//creat route
app.post("/blogs",function(req,res){
	//create blog
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
app.listen(process.env.PORT || 3001,function(){
	console.log("server is running!")
})