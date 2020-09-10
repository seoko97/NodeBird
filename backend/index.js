// 서버쪽 거의 모든 모듈을 담당하는 중앙통제실
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));

// express.static: express에서 제공하는 미들웨어, uploads폴더를 통해
// 서로 다른 서버에서 이미지를 자유롭게 가져올수 있도록 함
// '/': uploads 폴더를 루트폴더처럼 사용
app.use('/', express.static('uploads'));
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	expressSession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: false, // https를 쓸 때 true
		},
		name: 'rnbck',
	}),
);

// 미들웨어간에 서로 의존관계가 있는 경우 순서가 중요 (passport.session()은 expressSession()아래에 적어줘야함)
// 서버쪽 세션과 프론트 세션, 매번 로그인한 사용자가 누구인지 확인하기 위해 passport를 사용
app.use(passport.initialize());
app.use(passport.session());

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.listen(3065, () => {
	console.log('server is running on http://localhost:3065');
});
