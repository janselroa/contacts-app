const express = require("express")
const path = require("path")
const flash = require('connect-flash')
const cookieParser = require("cookie-parser")
require("dotenv").config({path:path.join(__dirname,"/.env")})
const {engine} = require("express-handlebars")
const session = require('express-session');
const multer = require("multer")
const app = express()
const port = process.env.PORT || 3000


app.use(session({
    secret:'geeksforgeeks',
    saveUninitialized: true,
    resave: true
}));

app.use(cookieParser())
app.use(flash());
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","hbs")
app.engine('hbs', engine({
	defaultLayout:"main",
	extname:".hbs"
}));

const storage = multer.diskStorage({
	destination:path.join(__dirname,"/public/img/uploads"),
	filename:(req,file,cb)=>{
		cb(null,file.originalname)
	}
})

app.use(multer({
	storage
}).single("profile"))
app.use(require("morgan")("dev"))
app.use("/public",express.static(path.join(__dirname,"/public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(require("./router/router"))

app.use("/api",require("./router/api"))
app.get("/logout",(req,res)=>{
	res.clearCookie("logged")
	res.clearCookie("name")
	res.clearCookie("email")
	res.clearCookie("profile")
	res.redirect("/")
})
app.listen(port,()=>console.log(`Applicaction running on http://localhost:${port}`))