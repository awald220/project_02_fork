const db = require("../models");

module.exports =  function(app) {
	// Load index page
	app.get("/", function(req, res) {
		db.Example.findAll({}).then(function(dbExamples) {
			res.render("index", {
				msg: "Welcome!",
				examples: dbExamples,
			});
		});
	});

	app.get("/play", (req, res) => {
		let userId = req.query.userId;
		console.log(req.query);
		db.Game.findAll({ where: { busy: false, active: true } }).then(async function(
			results
		) {
			console.log(results);
			let game;
			let allGames = results.map(e=>e.dataValues) ;
			console.log("allGames",allGames);


			if (allGames.length === 0) {
				let result = await createGame();
				game = result.dataValues;
			} else {
				game = results.find((result) => {
					let users = result.users.split(",");
					return !users.some((user) => user === userId);
				});
				if (!game) {
					// game = createGame()
				}
			}
			let prompts = [
				game.original,
				game.second,
				game.third,
				game.fourth,
				game.final,
			];
			prompts = prompts.filter((e) => e);
			let userIds;
			if(game.userIds){
				userIds=game.userIds + ","+userId;
			}else{
				userIds = userId;
			}
			db.Game.update({userIds: userIds},{where: {id: game.id}} );
			res.render("gamePlay", {
				prompt: prompts[prompts.length - 1],
			});
		});
	});

	// Load example page and pass in an example by id
	app.get("/game/:id", function(req, res) {
		db.Game.findOne({ where: { id: req.params.id } }).then(function(dbGame) {
			res.render("gameDetails", {
				game: dbGame,
			});
		});
	});

	app.get("/allgames", (req, res) => {
		db.Game.findAll({ active: false }).then((result) => {
			res.render("allGames", { games: result });
		});
	});

	// Render 404 page for any unmatched routes
	app.get("*", function(req, res) {
		res.render("404");
	});
  
	function createGame(){
		let prompt = "this is the original prompt"; // random sentence api
		return 	db.Game.create({
			original: prompt,
			active: true,
			busy: true,
		});
	} 
};