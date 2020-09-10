module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User', // 테이블 명을 User로 설정시 -> users로 변경됨 (sequelize 기능)
		{
			// 데이터베이스 칼럼
			nickname: {
				type: DataTypes.STRING(20),
				// allowNull: 필수 (db의 null)
				allowNull: false,
			},
			userId: {
				type: DataTypes.STRING(20),
				allowNull: false,
				// 고유한 값
				unique: true,
			},
			password: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
		},
		{
			charset: 'utf8',
			collate: 'utf8_General_ci',
		},
	);

	// 참조하는 테이블을 작성
	User.associate = (db) => {
		db.User.hasMany(db.Post, { as: 'Posts' });
		db.User.hasMany(db.Comment);
		db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
		db.User.belongsToMany(db.User, {
			through: 'Follow',
			as: 'Followers',
			foreignKey: 'followingId',
		});
		db.User.belongsToMany(db.User, {
			through: 'Follow',
			as: 'Followings',
			foreignKey: 'followerId',
		});
	};

	return User;
};

// 만약 user를 불러올경우
// const user = {
// 	id: 1,
// 	nickname: 'Sh',
// 	Liked: [{ 게시글1 }, { 게시글2 }, { 게시글3 }], // 좋아요 누른 게시글
//  Posts: [{ 게시글1 }, { 게시글2 }, { 게시글3 }], // 내가 쓴 게시글
// 	Followers: [{ 사용자1 }, { 사용자2 }, { 사용자3 }], // 나의 팔로워
// };
// 처럼 불러온다. as를 통해 설정된 테이블 이름을 통해 해당 테이블에 저장되어 있는 정보를 불러온다.

// mysql 사용시
// mysql - knex(js를 편하게 sql문으로 변환) - sequelize/typeorm(테이블까지 관리)
