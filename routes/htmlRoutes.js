const axios = require('axios');
const db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    res.render('index', {
      msg: 'Welcome!',
    });
  });

  app.get('/play', (req, res) => {
    const { userId } = req.query;

    db.Game.findAll({ where: { busy: false, active: true } }).then(
      async function(results) {
        let game;
        const allGames = results.map(e => e.dataValues);

        if (allGames.length === 0) {
          const result = await createGame();
          game = result.dataValues;
        } else {
          game = allGames.find(result => {
            const users = result.userIds.split(',');
            console.log('users', users, userId);
            return !users.some(user => user === userId);
          });
          if (game) {
            db.Game.update({ busy: true }, { where: { id: game.id } });
          } else {
            const result = await createGame();
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
        prompts = prompts.filter(e => e);

        res.render('gamePlay', {
          prompt: prompts[prompts.length - 1],
          gameId: game.id,
        });
      }
    );
  });

  // Load example page and pass in an example by id
  app.get('/game/:id', function(req, res) {
    db.Game.findOne({ where: { id: req.params.id } }).then(function(dbGame) {
      res.render('gameDetails', {
        game: dbGame,
      });
    });
  });

  app.get('/allgames', (req, res) => {
    db.Game.findAll({ active: false }).then(result => {
      res.render('allGames', { games: result });
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });

  function createGame() {
    return new Promise((resolve, reject) => {
      let prompt;

      axios
        .get('http://quotes.stormconsultancy.co.uk/random.json')
        .then(res => {
          prompt = res.data.quote;
          resolve(
            db.Game.create({
              original: prompt,
              active: true,
              busy: true,
            })
          );
        })
        .catch(err => reject('there was an error'));
    });
  }
};
