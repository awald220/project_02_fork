const db = require("../models");

module.exports = function (app) {
	// Load index page
	app.get("/", function (req, res) {
		res.render("index", {
			msg: "Welcome!",
		});
	});

	app.get("/play", (req, res) => {
		let userId = req.query.userId;
		db.Game.findAll({ where: { busy: false, active: true } }).then(
			async function (results) {
				let game;
				let allGames = results.map((e) => e.dataValues);

				if (allGames.length === 0) {
					let result = await createGame();
					game = result.dataValues;
				} else {
					game = allGames.find((result) => {
						let users = result.userIds.split(",");
						return !users.some((user) => user === userId);
					});
					if (game) {
						db.Game.update({ busy: true }, { where: { id: game.id } });
					} else {
						let result = await createGame();
						game = result.dataValues;
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

				res.render("gamePlay", {
					prompt: prompts[prompts.length - 1],
				});
			}
		);
	});

	// Load example page and pass in an example by id
	app.get("/game/:id", function (req, res) {
		db.Game.findOne({ where: { id: req.params.id } }).then(function (dbGame) {
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
	app.get("*", function (req, res) {
		res.render("404");
	});

	function createGame() {
		let prompt = "this is the second original prompt"; // random sentence api
		return db.Game.create({
			original: prompt,
			active: true,
			busy: true,
		});
	}
};
