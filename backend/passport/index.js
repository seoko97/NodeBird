// 로그인을 담당하는 파일
const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
	// passport.serializeUser(()=>{})
	// 한 사용자당 프로필에 저장된 정보는 매우 큰데
	// 그 정보를 서버쪽 메모리에 저장시 부담이 간다.
	// 아이디는 자동으로 하나씩 만들어 주기 때문에 (mysql) 로그인을 할때 serializeUser를 통해 서버쪽에 배열로 저장 (ex: [{id: 3, cookie: 'asdfgh'}])
	// 쿠키를 프론트에서 서버로 전송해 해당 쿠키를 가진 아이디의 정보를 불러옴
	passport.serializeUser((user, done) => {
		return done(null, user.id);
	});

	// passport.deserializeUser(()=>{})
	// serializeUser를 통해 서버에 저장된 것은 아이디밖에 없기 때문에 deserializeUser를 통해 해당아이디 값으로 정보를 사용할 수 있게 함
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await db.User.findOne({
				where: { id },
				include: [
					{
						model: db.Post,
						as: 'Posts',
						attributes: ['id'],
					},
					{
						model: db.User,
						as: 'Followings',
						attributes: ['id'],
					},
					{
						model: db.User,
						as: 'Followers',
						attributes: ['id'],
					},
				],
			});
			return done(null, user); // req.user
		} catch (e) {
			console.error(e);
			return done(e);
		}
	});

	local();
};
// 프론트에서 서버로는 cookie만 보냄
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser에 들어감
// done(null, user) 를 통해 req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행
// 실무에서는 deserializeUser 결과를 캐싱함 (db요청에 들어가는 비용이 많기 때문에 한번찾은 유저는 다시 찾지 않음)

// ** 로그인 사이클
// 1. 로그인 요청
// http://localhost:3000/api/user/login 으로 로그인 api를 요청

// 2. passport.authenticate 메서드 호출
// back/routes/user.js
// 해당 api 라우터에서 passport.authenticate 실행
// passport.authenticate('local', (err, user, info) => { ...

// 3. 로그인 전략 수행
// back/passport/local.js
// 프론트에서 전달한 userId, password를 usernameField, passwordField필드에 지정하고 전략 수행
//     passport.use(new LocalStrategy({
//         usernameField : 'userId',
//         passwordField : 'password',
//     }, async (id, password, done) => {
//         try {
//             const user = await db.User.findOne({ where : { userId }});
//             if (!user) {
//                 return done(null, false, { reason : '존재하지 않는 사용자입니다!' });
//             }
//             const result = await bcrypt.compare(password, user.password);
//             if (result) {
//                 return done(null, user);
//             }
//             return done(null, false, { reason : '비밀번호가 틀립니다.' })
//         } catch (e) {
//             console.error(e);
//             return done(e);
//         }
//     }));

// 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
// back/routes/user.js
// 로그인 성공 시 다시 라우터로 들어가서 (err, user, info) => 콜백 부분이 실행되어 프론트로 로그인된 유저 정보 보내줌
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             console.error(err);
//             next(err);
//         }
//         if (info) {
//             return res.status(401).send(info.reason);
//         }
//         return req.logIn(user, (loginErr) => {
//             if (loginErr) {
//                 return next(loginErr);
//             }
//             const filteredUser = Object.assign({}, user);
//             delete filteredUser.password;
//             return res.json(filteredUser);
//         });
//     })(req, res, next);

// 4-1.req.logIn 성공 시 serialize 실행
// req.logIn이 성공하면 성공한 유저 id를 세션에 저장, 쿠키 만들어 서버 메모리에 저장
//     passport.serializeUser((user, done) => {
//         return done(null, user.id);
//     });

// 5. front / user-saga 에서 axios 결과값 result.data로 전달
// http://localhost:8080/api/user/login 의 axios 응답을 받아 (req.user) LOG_IN_SUCCESS 에서 result.data 를 action.data로 지정

// function loginAPI(loginData) {
//     // 서버 요청
//     return axios.post('http://localhost:8080/api/user/login', loginData);
// }

// function* login(action) {
//     try {
//         const result = yield call(loginAPI, action.data);
//         yield put({
//             type : LOG_IN_SUCCESS,
//             data : result.data,
//         });
//     } catch (e) {
//         console.error(e);
//         yield put({
//             type : LOG_IN_FAILURE
//         });
//     }
// }

// 6. front / user-reducer 에서 me 값에 result.data 넣기 (req.user정보)
// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         ...
//         case LOG_IN_SUCCESS : {
//             return {
//                 ...state,
//                 isLoggingIn : false,
//                 isLoggedIn : true,
//                 me : action.data,
//             }
//         }
