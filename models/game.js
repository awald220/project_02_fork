module.exports = function(sequelize, DataTypes) {
	const Game = sequelize.define("Game", {
		original: DataTypes.STRING,
		second: DataTypes.STRING,
		third: DataTypes.STRING,
		fourth: DataTypes.STRING,
		final: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		busy: DataTypes.BOOLEAN,
		userIds: DataTypes.STRING
	});
	// Game.associate = function(models){
	// 	Game.belongsTo(models.User, {
	//     foreignKey: {
	//       allowNull:
	//     }
	//   });
	// };
	return Game;
};
