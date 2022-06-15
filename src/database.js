const mysql = require("mysql")
const pool = mysql.createPool({
	host:process.env.DBHOST,
	user:process.env.DBUSER,
	password:process.env.DBPASS,
	database:process.env.DBNAME
})
pool.getConnection((err)=>{
	if(err) throw err
	else console.log("Connected to database")
})
module.exports = pool