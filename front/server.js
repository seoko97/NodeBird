const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

// 개발모드일때
const dev = process.env.NODE_ENV !== 'production';
// 배포모드일때
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });

// 요청처리기
const handle = app.getRequestHandler();
dotenv.config();

// 프론트에서 동적 페이지를 만들기 위해(next8 기준)
// next내부에서 express를 사용함
// 백엔드와 구동방식이 거의 같음
app.prepare().then(() => {
	const server = express();

	server.use(morgan('dev'));
	server.use('/', express.static(path.join(__dirname, 'public')));
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(cookieParser(process.env.COOKIE_SECRET));
	server.use(
		expressSession({
			resave: false,
			saveUninitialized: false,
			secret: process.env.COOKIE_SECRET,
			cookie: {
				httpOnly: true,
				secure: false,
			},
		}),
	);

	server.get('/hashtag/:tag', (req, res) => {
		return app.render(req, res, '/hashtag', { tag: req.params.tag });
	});

	server.get('/user/:id', (req, res) => {
		return app.render(req, res, '/user', { id: req.params.id });
	});

	server.get('/post/:id', (req, res) => {
		return app.render(req, res, '/post', { id: req.params.id });
	});

	server.get('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(3060, () => {
		console.log('next+express running on port 3060');
	});
});
