const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
	// GET /api/posts
	try {
		let where = {};
		if (parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than
				},
			};
		}
		const posts = await db.Post.findAll({
			where,
			include: [
				{
					// 게시글을 작성한 유저 호출

					model: db.User,
					attributes: ['id', 'nickname'],
				},
				{
					model: db.Image,
				},
				{
					// 좋아요를 누른 유저 호출

					model: db.User,
					through: 'Like',
					as: 'Likers',
					attributes: ['id'],
				},
				{
					// 리트윗 데이터 호출

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
			order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
			limit: parseInt(req.query.limit, 10),
		});
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

// sequlize 에서 include를 통해 감편하게 db에 접근 가능
// 단, include의 남용이 db 성능 저하를 일으킴

module.exports = router;
