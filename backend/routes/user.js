// 회원가입 컨트롤러
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const router = express.Router();

// localhost 뒤에 붙는 주소, 요청이 들어올경우 해당 값을 리턴
// get: 페이지를 가져옴, post: 정보 등록
// API 는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
// 프론트에서 백엔드에 요청을 보내고 실행할 수 있도록

// /api/user
// 내정보
router.get('/', isLoggedIn, (req, res) => {
	const user = Object.assign({}, req.user.toJSON());
	delete user.password;

	return res.json(user);
});

// 사용자 정보 등록, 회원 가입
router.post('/', async (req, res, next) => {
	try {
		// db의 User 테이블을 불러옴
		// 비동기 프로미스이기 때문에 async / await를 붙여줌

		const exUser = await db.User.findOne({
			// 기존에 가입한 사람이 있는지 확인
			where: {
				userId: req.body.userId,
			},
		});
		if (exUser) {
			// 숫자에 따라 send로 서버에서 프론트로 보내는 요청이 다름
			// (200: 성공, 300: 리다이렉션, 400: 요청오류, 500: 서버오류)
			// send: 문자열을 프론트로 전송 (서버 -> 프론트)
			return res.status(403).send('이미 사용중인 아이디입니다.');
		}
		const hashedPasswdord = await bcrypt.hash(req.body.password, 12); // 비밀번호 암호화 (뒤에 숫자: 숫자가 커질 수 록 암호화가 커짐, 10~12사이로)

		const newUser = await db.User.create({
			nickname: req.body.nickname,
			userId: req.body.userId,
			password: hashedPasswdord,
		});

		// json: 데이터를 프론트로 전송 (서버 -> 프론트), 객체
		return res.status(200).json(newUser);
	} catch (e) {
		console.error(e);
		// nxet: 서버에서 에러가 났을 경우
		// 에러처리를 여기서
		return next(e);
	}
});

// 남의 정보 ex) /api/user/3 = 아이디가 3인 user정보 가져오기
router.get('/:id', async (req, res, next) => {
	// 남의 정보 가져오는 것 ex) /api/user/123
	try {
		const user = await db.User.findOne({
			where: { id: parseInt(req.params.id, 10) },
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
			attributes: ['id', 'nickname'],
		});
		const jsonUser = user.toJSON();
		jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
		jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
		jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
		res.json(jsonUser);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

// 로그인, 로그아웃 정보 등록 (기능)
router.post('/logout', (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('로그아웃 성공');
});

router.post('/login', (req, res, next) => {
	// POST /api/user/login
	// authenticate('사용할 로그인 방식', (서버에러, 성공시 사용자 정보, 로직 에러)done에서 받은 정보)
	passport.authenticate('local', (err, user, info) => {
		// 서버에러시
		if (err) {
			console.error(err);
			//next 명령어를 통해 에러 전송
			return next(err);
		}

		// 로직 에러시 스테이터스에 문자열로 에러 전송
		if (info) res.status(401).send(info.reason);

		return req.login(user, async (loginErr) => {
			try {
				// 로그인 에러시
				if (loginErr) next(loginErr);

				const fullUser = await db.User.findOne({
					where: { id: user.id },
					include: [
						{
							model: db.Post,
							as: 'Posts',
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
					attributes: ['id', 'nickname', 'userId'],
				});

				// return res.json(user) 와 같은 방식으로 프론트에 로그인 데이터를 전송할 경우
				// 함께 들어있는 비밀번호 데이터까지 보내게 되므로
				// 얕은 복사를 통해 user의 정보를 객체로 복사, password를 지워주고 데이터를 전송한다.
				// const filteredUser = Object.assign({}, user.toJSON());
				// delete filteredUser.password;

				return res.json(fullUser);
			} catch (e) {
				console.error(e);
				next(e);
			}
		});
	})(req, res, next);
});

// 해당 아이디 값의 팔로우 정보 등록, 가져오기, 삭제, 팔로워 삭제
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
	try {
		// 현재 로그인 되어있는 사용자의 정보 호출
		const me = await db.User.findOne({
			where: { id: req.user.id },
		});

		// sequelize의 기능인 add를 사용해 Following칼럼에 호출한 아이디
		await me.addFollowing(req.params.id);
		res.send(req.params.id);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

// 내가 팔로우한 유저정보
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
	try {
		// 현재 로그인한 유저의 정보를 호출
		const user = await db.User.findOne({
			where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
		});

		// 호출한 유저정보를 토대로 Followers 컬럼의 정보를 가져옴
		const followers = await user.getFollowers({
			// 옵션 가능
			attributes: ['id', 'nickname'],
			limit: parseInt(req.query.limit, 10),
			offset: parseInt(req.query.offset, 10),
		});
		res.json(followers);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//나를 팔로잉한 유저정보
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
	try {
		// 현재 로그인한 유저의 정보를 호출
		const user = await db.User.findOne({
			where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
		});

		// 호출한 유저정보를 토대로 Followers 컬럼의 정보를 가져옴
		const followings = await user.getFollowings({
			// 옵션 가능
			attributes: ['id', 'nickname'],
			limit: parseInt(req.query.limit, 10),
			offset: parseInt(req.query.offset, 10),
		});
		res.json(followings);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
	try {
		const me = await db.User.findOne({
			where: { id: req.user.id },
		});

		// 선택한 유저정보를 Follower에서 삭제
		await me.removeFollower(req.params.id);

		// 삭제된 유저정보 프론트로 전송
		res.send(req.params.id);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
	try {
		const me = await db.User.findOne({
			where: { id: req.user.id },
		});
		await me.removeFollowing(req.params.id);
		res.send(req.params.id);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

// 해당 아이디 값에 포스트 불러오기
router.get('/:id/posts', async (req, res, next) => {
	try {
		const posts = await db.Post.findAll({
			where: {
				UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
				RetweetId: null,
			},
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
				{
					model: db.Image,
				},
				// 좋아요를 누른 유저 호출
				{
					model: db.User,
					through: 'Like',
					as: 'Likers',
					attributes: ['id'],
				},
			],
		});
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		// db.User.update((수정사항), (조건))

		await db.User.update(
			{
				nickname: req.body.nickname,
			},
			{
				where: { id: req.user.id },
			},
		);
		res.send(req.body.nickname);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
