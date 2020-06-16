var db = require("../models");

module.exports = function(app){
    app.get("/api/users", function(req, res){
        console.log("hello")
        db.User.findAll({
            where: {
                name: req.body.name
            }
        }).then(function(dbUser){
            
            res.json(dbUser);
        })
    })

    app.post("/api/users", function(req, res){
        db.User.findOne({
            where: {
                name: req.body.name
            }
        }).then(function(dbUser){
            if(dbUser)

            db.User.create(req.body).then(function(dbUser){
                res.json(dbUser);
            })
        })

        
    })
}