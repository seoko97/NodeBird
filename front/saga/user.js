import { all, fork, call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_IN_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_FAILURE,
	SIGN_UP_SUCCESS,
	LOG_OUT_SUCCESS,
	LOG_OUT_REQUEST,
	LOG_OUT_FAILURE,
	LOAD_USER_SUCCESS,
	LOAD_USER_FAILURE,
	LOAD_USER_REQUEST,
	UNFOLLOW_USER_REQUEST,
	UNFOLLOW_USER_FAILURE,
	UNFOLLOW_USER_SUCCESS,
	FOLLOW_USER_SUCCESS,
	FOLLOW_USER_FAILURE,
	FOLLOW_USER_REQUEST,
	LOAD_FOLLOWINGS_SUCCESS,
	LOAD_FOLLOWINGS_FAILURE,
	LOAD_FOLLOWINGS_REQUEST,
	LOAD_FOLLOWERS_SUCCESS,
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWERS_FAILURE,
	REMOVE_FOLLOWER_SUCCESS,
	REMOVE_FOLLOWER_FAILURE,
	REMOVE_FOLLOWER_REQUEST,
	EDIT_NICKNAME_SUCCESS,
	EDIT_NICKNAME_FAILURE,
	EDIT_NICKNAME_REQUEST,
} from '../reducers/user';

// 로그인 액션
// axios.post('보낼주소', 실행할 제네레이터(데이터), axios 설정)
function logInAPI(logInData) {
	return axios.post('/user/login', logInData, { withCredentials: true });
}

function* logIn(action) {
	try {
		// axios 응답에 따른 데이터가 저장되어있는 result 변수
		const result = yield call(logInAPI, action.data);
		yield put({
			// put: dispatch 동일
			type: LOG_IN_SUCCESS,
			// result의 data에는 axios 응답에 따른 데이터가 저장되어 있음
			data: result.data,
		});
	} catch (e) {
		console.error(e);

		yield put({
			type: LOG_IN_FAILURE,
			reason: e.response && e.response.data,
		});
	}
}

function* watchLogIn() {
	yield takeEvery(LOG_IN_REQUEST, logIn);
}

// 회원가입 액션
function signUpAPI(signUpData) {
	return axios.post('/user/', signUpData);
}

function* signUp(action) {
	try {
		yield call(signUpAPI, action.data);
		yield put({
			// put: dispatch 동일
			type: SIGN_UP_SUCCESS,
		});
	} catch (e) {
		console.error(e);

		yield put({
			type: SIGN_UP_FAILURE,
			error: e,
		});
	}
}

function* watchSignUp() {
	yield takeEvery(SIGN_UP_REQUEST, signUp);
}

// 로그아웃 액션
// 로그아웃은 데이터가 필요X 쿠키가 알아서 처리
function logOutAPI() {
	return axios.post(
		'/user/logout',
		{},
		{
			withCredentials: true,
		},
	);
}

function* logOut() {
	try {
		yield call(logOutAPI);
		yield put({
			// put: dispatch 동일
			type: LOG_OUT_SUCCESS,
		});
	} catch (e) {
		console.error(e);

		yield put({
			type: LOG_OUT_FAILURE,
			error: e,
		});
	}
}
function* watchLogOut() {
	yield takeEvery(LOG_OUT_REQUEST, logOut);
}

// 사용자 정보 가져오기
function loadUserAPI(userId) {
	// 서버에 요청을 보내는 부분
	return axios.get(userId ? `/user/${userId}` : '/user/', {
		withCredentials: true, // 클라이언트에서 요청을 보낼 때는 브라우저가 쿠키를 같이 동봉
	}); // 서버사이드 렌더링일 때는 브라우저가 없음
}
function* loadUser(action) {
	try {
		const result = yield call(loadUserAPI, action.data);
		yield put({
			// put은 dispatch 동일
			type: LOAD_USER_SUCCESS,
			data: result.data,
			me: !action.data,
		});
	} catch (e) {
		// loginAPI 실패
		console.error(e);
		yield put({
			type: LOAD_USER_FAILURE,
			error: e,
		});
	}
}
function* watchLoadUser() {
	yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

// 팔로우
function FollowAPI(userId) {
	return axios.post(
		`/user/${userId}/follow`,
		{},
		{
			withCredentials: true,
		},
	);
}
function* Follow(action) {
	try {
		const result = yield call(FollowAPI, action.data);
		yield put({
			type: FOLLOW_USER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: FOLLOW_USER_FAILURE,
			error: e,
		});
	}
}
function* watchFollow() {
	yield takeEvery(FOLLOW_USER_REQUEST, Follow);
}

// 언팔로우
function unFollowAPI(userId) {
	return axios.delete(`/user/${userId}/follow`, {
		withCredentials: true,
	});
}
function* unFollow(action) {
	try {
		const result = yield call(unFollowAPI, action.data);
		yield put({
			type: UNFOLLOW_USER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: UNFOLLOW_USER_FAILURE,
			error: e,
		});
	}
}
function* watchUnFollow() {
	yield takeEvery(UNFOLLOW_USER_REQUEST, unFollow);
}

// 내 팔로워 불러오기
function loadFollowersAPI(userId, offset = 0, limit = 3) {
	return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
		withCredentials: true,
	});
}
function* loadFollowers(action) {
	try {
		const result = yield call(loadFollowersAPI, action.data, action.offset);
		yield put({
			type: LOAD_FOLLOWERS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_FOLLOWERS_FAILURE,
			error: e,
		});
	}
}
function* watchLoadFollowers() {
	yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

// 날 팔로잉한 유저 불러오기
function loadFollowingsAPI(userId, offset = 0, limit = 3) {
	return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
		withCredentials: true,
	});
}
function* loadFollowings(action) {
	try {
		const result = yield call(loadFollowingsAPI, action.data, action.offset);
		yield put({
			type: LOAD_FOLLOWINGS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_FOLLOWINGS_FAILURE,
			error: e,
		});
	}
}
function* watchLoadFollowings() {
	yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

// 팔로워 삭제
function removeFollowerAPI(userId) {
	return axios.delete(`/user/${userId}/follower`, {
		withCredentials: true,
	});
}
function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.data);
		yield put({
			type: REMOVE_FOLLOWER_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: REMOVE_FOLLOWER_FAILURE,
			error: e,
		});
	}
}
function* watchRemoveFollower() {
	yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

// 닉네임 변경
function editNicknameAPI(nickname) {
	// patch: 정보 부분 수정
	// put: 정보 전체 수정
	return axios.patch(
		'/user/nickname',
		{ nickname },
		{
			withCredentials: true,
		},
	);
}
function* editNickname(action) {
	try {
		const result = yield call(editNicknameAPI, action.data);
		yield put({
			type: EDIT_NICKNAME_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: EDIT_NICKNAME_FAILURE,
			error: e,
		});
	}
}
function* watchEditNickname() {
	yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
	yield all([
		fork(watchLogIn),
		fork(watchSignUp),
		fork(watchLogOut),
		fork(watchLoadUser),
		fork(watchFollow),
		fork(watchUnFollow),
		fork(watchLoadFollowings),
		fork(watchLoadFollowers),
		fork(watchRemoveFollower),
		fork(watchEditNickname),
	]);
}

// fork(함수) == 함수() == call(함수) : 모두 함수를 실행하는 방식이다.
// call(함수): 동기 호출
// fork(함수): 비동기 호출
// call 메서드는 해당 함수가 실행이 완료될 때까지 대기한다. (순서를 지켜야 될 경우)
// fork 메서드를 실행시 해당 함수가 실행되자마자 다음 구문을 실행한다.
