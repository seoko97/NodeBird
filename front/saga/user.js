import { all, takeLatest, fork, call, put } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILRE } from '../reducers/user';

// 로그인 액션
function loginAPI() {
	//서버에 요청을 보내는 부분
}

function* login() {
	try {
		yield call(loginAPI);
		yield put({
			// put: dispatch 동일
			type: LOG_IN_SUCCESS,
		});
	} catch (e) {
		console.error(e);

		yield put({
			// put: dispatch 동일
			type: LOG_IN_FAILRE,
		});
	}
}

function* watchLogin() {
	yield takeLatest(LOG_IN, login);
}

export default function* userSaga() {
	yield all([fork(watchLogin)]);
}
