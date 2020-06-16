var db = require("../models");

module.exports = function(app) {
    app.get("/api/game/open", function(req, res){
        db.Game.findAll({
            where: {
                active: true,
                busy: false
            }
        }).then(function(dbGame){
            res.json(dbGame)
        })
    });

    app.put("/api/game", function(req, res){
        
    })
}