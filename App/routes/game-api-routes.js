const db = require("../models");

module.exports = function(app) {
	app.get("/api/game/open", function(req, res) {
		db.Game.findAll({
			where: {
				active: true,
				busy: false,
			},
		}).then(function(dbGame) {
			res.json(dbGame);
		});
	});

	app.put("/api/game", function(req, res) {
    
		let submission = req.body.submission;
		let gameId = req.body.gameId;
		let userId = req.body.userId;


		db.Game.findOne({
			where: {
				id: gameId
			}
		}).then(function(game) {
			let userIds;
			if(game.userIds){
				userIds=game.userIds + ","+userId;
			}else{
				userIds = userId;
			}
      
			let prompts = [
				game.original,
				game.second,
				game.third,
				game.fourth,
				game.final,
			];
      
			// Filter prompts to only be not null
			prompts = prompts.filter((e) => e);
      
			let newData = {userIds: userIds, busy: false};
			if (prompts.length === 5) {
				newData.active = false;
			}
			let dataArray = ["second", "third", "fourth", "final"];
			newData[dataArray[prompts.length-1]] = submission;

			db.Game.update(newData,{where: {id: game.id}} ).then(function(result) {
				// res.json(result);
			});
		});



		db.Game.update(req.body, {
			where: {
				id: req.body.id,
			},
		}).then(function(dbGame) {
			res.json(dbGame);
		});
	});
};