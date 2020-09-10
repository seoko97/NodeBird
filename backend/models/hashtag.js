// Hashtag는 post와 다대다관계 (n:m 관계)
// 다대다 관계는 중간에 테이블이 생성됨 (서로관의 관계를 나타내는 테이블)

module.exports = (sequelize, DataTypes) => {
	const Hashtag = sequelize.define(
		'Hashtag',
		{
			name: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
		},
		{
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci',
		},
	);
	Hashtag.associate = (db) => {
		db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
	};

	return Hashtag;
};
