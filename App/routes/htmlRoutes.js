const db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render('index', {
        msg: 'Welcome!',
        examples: dbExamples,
      });
    });
  });

  app.get('/play',(req,res)=>{
    let userId = req.body.userId;
    db.Game.findAll({where: {busy: false, active: true}}).then(function (results){
      let game;
      if(results.length === 0){
        // game = createGame()
      }else{
        game =results.find(result=>{
          let users = result.users.split(',');
          return !users.some(user=>user===userId)
        })
        if(!game){
          // game = createGame()
        }
      }
      let prompts = [game.first, game.second, game.third, game.fourth, game.final]
      prompts = prompts.filter(e=>e)
      res.render('gamePlay', {prompt: prompts[prompts.length-1], game: game.id})
    })
  })

  // Load example page and pass in an example by id
  app.get('/game/:id', function(req, res) {
    db.Game.findOne({ where: { id: req.params.id } }).then(function(
      dbGame
    ) {
      res.render('gameDetails', {
        game: dbGame,
      });
    });
  });

  app.get('allGames', (req,res)=>{
    db.Game.findAll({active: false}).then(result=>{
      res.render('allGames',{games: result})
    })
  })

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
};
