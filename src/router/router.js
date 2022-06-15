const {Router} = require("express")
const bcrypt = require("bcryptjs")
const pool = require("../database.js")
const router = Router()

router.get("/",async (req,res)=>{
	if(req.cookies.logged){
		pool.query("select * from contacts where userId = ?",[req.cookies.userId],(err,contacts)=>{
			if(err) throw err
			else res.render("index",{contacts})
		})
	}else res.render("welcome")
})

// login
router.get("/register",(req,res)=>{
	res.render("register")
})

router.post("/register",async (req,res)=>{
	const regEmail  = /\S+@\S+\.\S+/
	const name = req.body.name
	const password = req.body.password 
	const email = req.body.email
	const profile = req.file.originalname || "profile.jpg"
	const passwordHash = await bcrypt.hashSync(password)
	if(name && password && email && regEmail.test(email)){
		pool.query("INSERT INTO users SET ?",{name,password:passwordHash,email,profile},(err)=>{
			if(err) throw err
			else {
				req.flash("message","Registracion exitosa  ahora inicie sesion para usar la aplicacion")
				res.redirect("/login")
			}
		})
	}
})
router.get("/login",(req,res)=>{
	res.render("login",{message:req.flash("message")})
})
router.post("/login",async (req,res)=>{
	const email = req.body.email
	const password = req.body.password
	let messageError = ""
	if(email && password){
		pool.query("select * from users where email = ?",[email],async (err,results)=>{
			if(err) throw err
			else{
				if(results.length>0){
					if(await bcrypt.compareSync(password,results[0].password) ){
						res.cookie("logged",true)
						res.cookie("name",results[0].name)
						res.cookie("email",results[0].email)
						res.cookie("profile",results[0].profile)
						res.cookie("userId",results[0].id)
						req.flash("success","Login exitoso ahora puedes usar la aplicacion")
						res.redirect("/")
					}else messageError = "La contraseña no conincide" 
				}else messageError = "Email no registrado"

			}
			if(messageError) {
				res.flash("success",messageError)
				res.redirect("/login")
			}
		})
	}
})

//contacts
router.post("/contacts",(req,res)=>{
	const name = req.body.name
	const profile = req.file.originalname
	const email = req.body.email
	const numberPhone = req.body.phoneNumber
	pool.query("INSERT INTO contacts SET ?",{name, profile,email,userId:req.cookies.userId},(err)=>{
		if(err) throw err
		else res.redirect("/")
	})
})
router.get("/contacts/delete/:id",(req,res)=>{
	pool.query("delete from contacts where id = ?",[req.params.id],(err)=>{
		if(err) throw err
		else{
			res.redirect("/")
		}
	})
})

//count
router.get("/count",(req,res)=>{
	res.render("count",{
		name:req.cookies.name,
		email:req.cookies.email,
		profile:req.cookies.profile,
	})
})
module.exports = router