const {Router} = require("express")
const bcrypt = require("bcryptjs")
const pool = require("../database.js")
const router = Router()

router.get("/",async (req,res)=>{
	if(req.cookies.logged){
		pool.query("select * from contacts where userId = ?",[req.cookies.userId],(err,contacts)=>{
			if(err) res.status(500).json({
				error:500,
				description:"Lo siento a habido algun tipo de error en el servidor, intente nuevamente"
			})
			else res.status(200).send(contacts)
		})
	}else res.status(400).json({
		error:400,
		description:"Usuario no autentificado"
	})
})

// login

router.post("/register",async (req,res)=>{
	const regEmail  = /\S+@\S+\.\S+/
	const name = req.body.name
	const password = req.body.password 
	const email = req.body.email
	const profile = req.file.originalname
	const passwordHash = await bcrypt.hashSync(password)
	if(name && password && email && regEmail.test(email)){
		pool.query("INSERT INTO users SET ?",{name,password:passwordHash,email,profile},(err)=>{
			if(err) throw err
			else {
				res.json({
					message:"Registracion exitosa ahora puede iniciar session"
				})
				res.redirect("/login")
			}
		})
	}
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
						req.status(200).json({
							message:"Usuario autentificado correctamente, ahora acceda a / para ver sus contactos"
						})
					}else messageError = "La contraseña no conincide" 
				}else messageError = "Email no registrado"

			}
			if(messageError) {
				res.status(400).json({
					error:400,
					description:messageError
				})
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
		else res.status(201).json({
			status:201,
			message:"Contacto creado correctamente"
		})
	})
})
router.delete("/contacts/delete/:id",(req,res)=>{
	pool.query("delete from contacts where id = ?",[req.params.id],(err)=>{
		if(err) throw err
		else{
			res.redirect("/")
		}
	})
})

//count
router.get("/count",(req,res)=>{
	res.json({
		name:req.cookies.name,
		email:req.cookies.email,
		profile:req.cookies.profile,
	})
})
module.exports = router