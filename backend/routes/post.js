const express = require('express');
const multer = require('multer');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const path = require('path');
const { sequelize, Post } = require('../models');
const { abort } = require('process');
const router = express.Router();

// multer 설정 (파일 업로드)
const upload = multer({
	storage: multer.diskStorage({
		// destination: 어떤 경로에 저장할지
		destination(req, file, done) {
			// 'uploads'란 폴더에 저장
			// done(에러발생시 처리 방법, 성공시 처리 방법)
			done(null, 'uploads');
		},
		filename(req, file, done) {
			// 확장자 추출 (ex: wltjrgh.png, 추출된 이름: .png)
			const ext = path.extname(file.originalname);
			// 확장자를 제외한 이름  (ex: wltjrgh.png, 추출된 이름: wltjrgh)
			const basename = path.basename(file.originalname, ext);

			done(null, basename + new Date().valueOf() + ext);
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 },
});

// /api/post  //POST
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
	try {
		// 게시글 컨텐츠에서 해시태그 추출
		const hashtags = req.body.content.match(/#[^\s]+/g);

		const newPost = await db.Post.create({
			content: req.body.content,
			UserId: req.user.id,
		});

		if (hashtags) {
			const result = await Promise.all(
				hashtags.map((tag) =>
					// findOrCreate: 특정 요소를 검색하거나, 존재하지 않으면 새로 생성
					db.Hashtag.findOrCreate({
						where: { name: tag.slice(1).toLowerCase() },
					}),
				),
			);
			await newPost.addHashtags(result.map((r) => r[0]));
		}
		if (req.body.image) {
			// 배열인지 아닌지 검사하는 이유: 이미지를 하나 올렸을 때와 여러개 올렸을 때의 형태가 다름
			// 여러개) image: [주소1, 주소2, 주소3,...],
			if (Array.isArray(req.body.image)) {
				const images = await Promise.all(
					req.body.image.map((image) => {
						return db.Image.create({ src: image });
					}),
				);
				await newPost.addImages(images);
			} else {
				// 한개) image: 주소1;
				const image = await db.Image.create({
					src: req.body.image,
				});
				await newPost.addImage(image);
			}
		}

		const fullPost = await db.Post.findOne({
			where: { id: newPost.id },
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
				{
					model: db.Image,
				},
			],
		});

		return res.json(fullPost);
	} catch (e) {
		console.error(e);
		return next(e);
	}
});

// upload.array('image'): FormData.append 와 같이 설정
// 이미지 한장: single
// 여러장: array, fields
router.post('/images', upload.array('image'), (req, res) => {
	return res.json(req.files.map((v) => v.filename));
});

router.get('/:id/comments', async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}

		const comments = await db.Comment.findAll({
			where: {
				PostId: req.params.id,
			},
			order: [['createdAt', 'ASC']],
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		return res.json(comments);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(404).send('게시글이 없습니다.');
		}

		const newComment = await db.Comment.create({
			PostId: post.id,
			UserId: req.user.id,
			content: req.body.content,
		});

		await post.addComment(newComment.id);

		const comment = await db.Comment.findOne({
			where: {
				id: newComment.id,
			},
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
			],
		});

		return res.json(comment);
	} catch (e) {
		console.error(e);
		return next(e);
	}
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
	// req: 요청(서버) res: 전송(프론트), next(): 다음 코드를 실행하거나 에러를 프론트로 전송(Network)
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });

		if (!post) {
			return res.status(404).send('게시글이 없습니다.');
		}

		await post.addLiker(req.user.id);
		return res.json({ userId: req.user.id });
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });

		if (!post) {
			return res.status(404).send('게시글이 없습니다.');
		}

		// delete 를 사용할 때는 removeLiker를 사용하여 서버에 저장된정보를 지워준다.
		// remove{테이블 이름}, add{테이블 이름}, : sequelize에서 사용하는 associate의 as(Liker)를 통해 제공
		await post.removeLiker(req.user.id);
		return res.json({ userId: req.user.id });
	} catch (e) {
		console.error(e);
		next(e);
	}
});

// 리트윗시 서버요청
router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: db.Post,
					as: 'Retweet',
				},
			],
		});

		if (!post) {
			return res.status(404).send('포스트가 존재하지 않습니다.');
		}
		if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
			return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
		}
		const retweetTargetId = post.RetweetId || post.id;
		const exPost = await db.Post.findOne({
			where: {
				UserId: req.user.id,
				RetweetId: retweetTargetId,
			},
		});
		if (exPost) {
			return res.status(403).send('이미 리트윗했습니다.');
		}
		const retweet = await db.Post.create({
			UserId: req.user.id,
			RetweetId: retweetTargetId,
			content: 'retweet',
		});
		const retweetWithPrevPost = await db.Post.findOne({
			where: { id: retweet.id },
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
				{
					model: db.Post,
					as: 'Retweet',
					include: [
						{
							model: db.User,
							attributes: ['id', 'nickname'],
						},
						{
							model: db.Image,
						},
					],
				},
			],
		});
		res.json(retweetWithPrevPost);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: db.User,
					attributes: ['id', 'nickname'],
				},
				{
					model: db.Image,
				},
			],
		});

		return res.json(post);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(404).send('게시글이 없습니다.');
		}

		await db.Post.destroy({ where: { id: req.params.id } });
		return res.send(req.params.id);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
