const db = require('../models');

module.exports = function(app) {
  app.get('/api/game/open', function(req, res) {
    db.Game.findAll({
      where: {
        active: true,
        busy: false,
      },
    }).then(function(dbGame) {
      res.json(dbGame);
    });
  });

  app.put('/api/game', function(req, res) {
    const { submission } = req.body;
    const { gameId } = req.body;
    const { userId } = req.body;
    db.Game.findOne({
      where: {
        id: gameId,
      },
    }).then(function(game) {
      if (!game) {
        // theres probably a correct way of sending errors
        res.json({ error: true });
      }
      let userIds;
      if (game.userIds) {
        userIds = `${game.userIds},${userId}`;
      } else {
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
      prompts = prompts.filter(e => e);

      const newData = { userIds, busy: false };
      console.log(newData);
      if (prompts.length === 4) {
        newData.active = false;
      } else {
        newData.active = true;
      }
      const numberArray = ['second', 'third', 'fourth', 'final'];
      newData[numberArray[prompts.length - 1]] = submission;
      db.Game.update(newData, { where: { id: game.id } }).then(function(
        result
      ) {
        if (result === 0) {
          // maybe?
          // res.json({error:true})
        }
        res.json({ done: game.id });
      });
    });
  });
};
