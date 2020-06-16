module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    original: DataTypes.STRING,
    first: DataTypes.STRING,
    second: DataTypes.STRING,
    third: DataTypes.STRING,
    final: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    busy: DataTypes.BOOLEAN,
    userIds: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue('userIdArray'));
      },
      set(val) {
        return this.setDataValue('userIdArray', JSON.stringify(val));
      },
    },
  });
  return Game;
};
