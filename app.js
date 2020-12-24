//importing modules
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Post = require("./models/post"),
	Comment = require("./models/comment"),
	User = require("./models/user");



//requiring routes
var commentRoutes = require("./routes/comments"),
	postRoutes = require("./routes/posts"),
	indexRoutes = require("./routes/index");

//connecting to database
mongoose.connect("mongodb://localhost:27017/blog_soundarya",
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("connceted to Database !");})
.catch((err)=>{
	console.log(err);
})


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);


app.listen(3000, function () {
	console.log("server running on port 3000!");
});