const db = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function(app) {
	app.get("/api/users", function(req, res) {
		db.User.findAll({
			where: {
				name: req.body.name,
			},
		}).then(function(dbUser) {
			res.json(dbUser);
		});
	});

	app.post("/api/getuser",(req,res)=>{
		console.log(req.body)
		db.User.findOne({where: {name: req.body.name}}).then(dbUser=>{
			bcrypt.compare(req.body.password, dbUser.password, (err,result)=>{
				if(result){
					res.json({myId: dbUser.id, exists: true, name: dbUser.name});
				}
				else{
					res.json({
						exists: false
					});
				}
			});
		});
	});
	
	app.post("/api/users", function(req, res) {
		// Check if username already exists in database
		console.log("hi");
		db.User.findOne({
			where: {
				name: req.body.name,
			},
		}).then(function(dbUser) {
			// If user does not already exist, post user to database
			if (!dbUser) {
				bcrypt.genSalt(saltRounds, (err,salt)=>{
					bcrypt.hash(req.body.password, salt, (err, hash)=>{
						db.User.create({name: req.body.name, password: hash}).then(function(dbUserCreate) {
							res.json(dbUserCreate);
							console.log("User created");
							return;
						});
					});
				});
			} else {
				// If user already exists, notify that username is taken
				// TODO: Add code that notifies user on front end
				console.log("Username already exists");
				res.json({taken: true});
			}
		});
	});
};
