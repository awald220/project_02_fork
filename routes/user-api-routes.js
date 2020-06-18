const db = require("../models");

module.exports = function(app) {
	app.get("/api/users", function(req, res) {
		console.log("hello");
		db.User.findAll({
			where: {
				name: req.body.name,
			},
		}).then(function(dbUser) {
			res.json(dbUser);
		});
	});

	app.post("/api/users", function(req, res) {
		// Check if username already exists in database
		db.User.findOne({
			where: {
				name: req.body.name,
			},
		}).then(function(dbUser) {
			// If user does not already exist, post user to database
			if (dbUser === null) {
				db.User.create(req.body).then(function(dbUserCreate) {
					res.json(dbUserCreate);
					console.log("User created");
				});
			} else {
				// If user already exists, notify that username is taken
				// TODO: Add code that notifies user on front end
				console.log("Username already exists");
				res.json(false);
			}
		});
	});
};
