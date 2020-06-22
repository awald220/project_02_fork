const bcrypt = require('bcrypt');
const db = require('../models');

const saltRounds = 10;

module.exports = function(app) {
  app.get('/api/users', function(req, res) {
    db.User.findAll({
      where: {
        name: req.body.name,
      },
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.post('/api/getuser', (req, res) => {
    if (!req.body.name || !req.body.password) {
      res.json({ error: true });
    }
    db.User.findOne({ where: { name: req.body.name } }).then(dbUser => {
      if (!dbUser) {
        return res.json({ exists: false });
      }
      bcrypt.compare(req.body.password, dbUser.password, (err, result) => {
        if (result) {
          res.json({ userId: dbUser.id, exists: true, name: dbUser.name });
        } else {
          res.json({
            exists: false,
          });
        }
      });
    });
  });

  app.post('/api/users', function(req, res) {
    if (!req.body.name || !req.body.password) {
      res.json({ error: true });
    }

    // Check if username already exists in database
    db.User.findOne({
      where: {
        name: req.body.name,
      },
    }).then(function(dbUser) {
      // If user does not already exist, post user to database
      if (!dbUser) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            db.User.create({ name: req.body.name, password: hash }).then(function(dbUserCreate) {
              res.json(dbUserCreate);
            });
          });
        });
      } else {
        // If user already exists, notify that username is taken
        res.json({ taken: true });
      }
    });
  });
};
