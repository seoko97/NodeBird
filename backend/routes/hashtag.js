const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
	try {
		let where = {};
		if (parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					// less than
					[db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
				},
			};
		}

		const posts = await db.Post.findAll({
			where,
			include: [
				{
					model: db.Hashtag,
					// 보통 include 바깥에서 where를 통해 조건을 걸지만 Hasgtag에 관련된 조건을
					// 찾아야 하기 때문에 include내부에 조건을 작성한다.

					// decodeURIComponent: 주소창에서 한글은 변환되기 때문에 디코딩을 통해 복구한다.
					where: { name: decodeURIComponent(req.params.tag) },
				},
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
				// 리트윗 데이터 호출
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
			order: [['createdAt', 'DESC']],
			limit: parseInt(req.query.limit, 10),
		});

		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
