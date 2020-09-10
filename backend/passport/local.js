// 로그인 전략
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'userId',
				passwordField: 'password',
			},
			async (userId, password, done) => {
				// 여기에 로그인 전략이 들어감 (어떤사람을 로그인 시킬지)
				try {
					const user = await db.User.findOne({
						where: { userId },
					});

					// done(서버쪽 에러시, 성공시, 로직상에서시)
					if (!user) {
						return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
					}

					// bcrypt를 이용해 입력받은 비밀번호와 db에 저장된 유저의 비밀번호를 비교하여 true/false 반환
					const result = await bcrypt.compare(password, user.password);

					if (result) {
						// 성공시 이기 때문에 done이 갖는 인자는 2개
						return done(null, user);
					}
					return done(null, false, { reason: '비밀번호가 틀립니다.' });
				} catch (e) {
					console.error(e);
					return done(e);
				}
			},
		),
	);
};
