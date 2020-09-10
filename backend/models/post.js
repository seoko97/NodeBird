// module.exports = (sequelize, DataTypes) => {
// 	const Post = sequelize.define(
// 		'Post',
// 		{
// 			content: {
// 				type: DataTypes.STRING(140), // 매우 긴글
// 				allowNull: false,
// 			},
// 		},
// 		{
// 			// 한글 + 이모티콘
// 			charset: 'utf8mb4',
// 			collate: 'utf8mb4_general_ci',
// 		},
// 	);
// 	Post.associate = (db) => {
// 		db.Post.belongsTo(db.User);
// 		db.Post.hasmany(db.Comment);
// 		db.Post.hasmany(db.Image);

// 		// Post테이블 내부의 관계, 서로 이름이 구별이 안가기 때문에 as 를 통해 이름을 설정
// 		db.Post.belongsTo(db.Post, { as: 'Retweet' });
// 		db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

// 		// 다대다 관게를 위한 테이블 Like를 생성하고 이름을 Likers로 설정
// 		db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
// 	};

// 	return Post;
// };

module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		'Post',
		{
			// 테이블명은 posts
			content: {
				type: DataTypes.TEXT, // 매우 긴 글
				allowNull: false,
			},
		},
		{
			charset: 'utf8mb4', //  한글+이모티콘
			collate: 'utf8mb4_general_ci',
		},
	);
	Post.associate = (db) => {
		db.Post.belongsTo(db.User); // 테이블에 UserId 컬럼이 생겨요
		db.Post.hasMany(db.Comment);
		db.Post.hasMany(db.Image);
		db.Post.belongsTo(db.Post, { as: 'Retweet' }); // RetweetId 컬럼 생겨요
		db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
		db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
	};
	return Post;
};
