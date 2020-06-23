const axios = require('axios');
const request = require('request');
const db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    checkForBadWords();
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
          let result = false;
          result = await createGame();
          game = result.dataValues;
        } else {
          game = allGames.find(result => {
            const users = result.userIds.split(',');
            return !users.some(user => user === userId);
          });
          if (game) {
            db.Game.update({ busy: true }, { where: { id: game.id } });
          } else {
            let result = false;
            result = await createGame();
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
          userIds: game.userIds,
        });
      }
    );
  });

  // Load example page and pass in an example by id
  app.get('/game/:id', function(req, res) {
    db.Game.findOne({ where: { id: req.params.id } }).then(function(dbGame) {
      const userIdsArray = dbGame.dataValues.userIds.split(',');
      const promises = userIdsArray.map(userId =>
        db.User.findOne({ where: { id: userId } })
      );
      Promise.all(promises).then(results => {
        const users = results.map(r => r.dataValues.name);
        const game = {
          ...dbGame.dataValues,
          user1: users[0],
          user2: users[1],
          user3: users[2],
          user4: users[3],
        };
        res.render('gameDetails', game);
      });
    });
  });

  app.get('/allgames', (req, res) => {
    db.Game.findAll({ where: { active: false } }).then(result => {
      const dataValues = result.map(e => e.dataValues);
      res.render('allGames', { games: dataValues });
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
  function checkForBadWords(content) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://neutrinoapi.net/bad-word-filter?user-id=jkb&api-key=hYhtJxSTcj5qSeCG9og889jCFm0yH1Kn7vwhe1FKkJA5hVh8&censor-character=*&content=${content}`
        )
        .then(res => {
          resolve(res.data['censored-content'] || content);
        })
        .catch(err => resolve(false));
    });
  }

  function createGame() {
    return new Promise((resolve, reject) => {
      let prompt;
      axios
        .get('http://quotes.stormconsultancy.co.uk/random.json')
        .then(res => {
          prompt = res.data.quote;
          checkForBadWords(prompt).then(censored => {
            resolve(
              db.Game.create({
                original: censored,
                active: true,
                busy: true,
              })
            );
          });
        })
        .catch(err => reject('there was an error'));
    });
  }
};
