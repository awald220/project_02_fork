module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    original: DataTypes.TEXT,
    second: DataTypes.TEXT,
    third: DataTypes.TEXT,
    fourth: DataTypes.TEXT,
    final: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    busy: DataTypes.BOOLEAN,
    userIds: DataTypes.TEXT,
  });
  return Game;
};
