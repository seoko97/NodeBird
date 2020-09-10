exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send('로그인이 필요합니다.');
	}
};

exports.isNotLoggedin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// try catch 문과 next를 사용해 next(e)처럼 에러를 넘길 수도 있지만
		// 다음과 같이 true일때 다음 코드를 실행할 수도 있다.
		next();
	} else {
		res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
	}
};
exports.isNotPost = (req, res, next) => {};
