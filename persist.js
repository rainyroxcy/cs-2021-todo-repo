//This file is in charge of database connection

const mongoose = require("mongoose");
const db = mongoose.connection;

function connect(callback){
	let connectionString = `mongodb+srv://rainroxcy:Rossco123@cluster0.9uzoj.mongodb.net/rainroxcy?retryWrites=true&w=majority`

	console.log("connect to db...");

	mongoose
	.connect(connectionString,{
		useNewUrlParser:true,
		useUnifiedTopology:true,
	})
	.catch((err) =>{
		console.log("There was an error connecting to mongo:", err);
	});

	db.once("open", callback);

}


module.exports = {
	connect

};