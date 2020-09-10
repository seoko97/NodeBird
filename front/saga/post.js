import { all, fork, takeLatest, put, call, throttle } from 'redux-saga/effects';
import axios from 'axios';
import {
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	ADD_COMMENTS_SUCCESS,
	ADD_COMMENTS_FAILURE,
	ADD_COMMENTS_REQUEST,
	LOAD_MAIN_POSTS_SUCCESS,
	LOAD_MAIN_POSTS_FAILURE,
	LOAD_MAIN_POSTS_REQUEST,
	LOAD_HASHTAG_POSTS_SUCCESS,
	LOAD_HASHTAG_POSTS_FAILURE,
	LOAD_HASHTAG_POSTS_REQUEST,
	LOAD_USER_POSTS_FAILURE,
	LOAD_USER_POSTS_SUCCESS,
	LOAD_USER_POSTS_REQUEST,
	LOAD_COMMENTS_REQUEST,
	LOAD_COMMENTS_SUCCESS,
	LOAD_COMMENTS_FAILURE,
	UPLOAD_IMAGES_SUCCESS,
	UPLOAD_IMAGES_FAILURE,
	UPLOAD_IMAGES_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
	RETWEET_SUCCESS,
	RETWEET_FAILURE,
	RETWEET_REQUEST,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
	REMOVE_POST_REQUEST,
	LOAD_POST_REQUEST,
	LOAD_POST_SUCCESS,
	LOAD_POST_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// 포스트
function addPostAPI(postData) {
	return axios.post('/post', postData, {
		withCredentials: true,
	});
}
function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);
		yield put({
			// post reducer의 데이터를 수정
			type: ADD_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			// user reducer의 데이터를 수정
			type: ADD_POST_TO_ME,
			data: result.data.id,
		});
	} catch (e) {
		yield put({
			type: ADD_POST_FAILURE,
			error: e,
		});
	}
}
function* watchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

// 게시글 불러오기
function loadMainPostsAPI(lastId = 0, limit = 10) {
	return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}
function* loadMainPosts(action) {
	try {
		const result = yield call(loadMainPostsAPI, action.lastId);
		yield put({
			type: LOAD_MAIN_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		yield put({
			type: LOAD_MAIN_POSTS_FAILURE,
			errpr: e,
		});
	}
}
function* watchLoadMainPosts() {
	// throttle: 어떤 리퀘스트가 호출되고 다음 1초까지는 같은 리퀘스트가 호툴될 수 없음
	yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

// 다른 사용자 게시글 불러오기
function loadUserPostsAPI(id) {
	return axios.get(`/user/${id || 0}/posts`);
}
function* loadUserPosts(action) {
	try {
		const result = yield call(loadUserPostsAPI, action.data);
		yield put({
			type: LOAD_USER_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		yield put({
			type: LOAD_USER_POSTS_FAILURE,
			errpr: e,
		});
	}
}
function* watchLoadUserPosts() {
	yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
// 해당 해시태그 게시글 불러오기
function loadHashtagPostsAPI(tag, lastId = 0) {
	// 타입에러: 주소창에 한글 불가능
	// encodeURIComponent 를 통해 한글이나 특수문자 사용 가능
	return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=10`);
}

function* loadHashtagPosts(action) {
	try {
		const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
		yield put({
			type: LOAD_HASHTAG_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		yield put({
			type: LOAD_HASHTAG_POSTS_FAILURE,
			error: e,
		});
	}
}
function* watchLoadHashtagPosts() {
	yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

// 게시물에 댓글 달기
function addCommentAPI(data) {
	return axios.post(
		`/post/${data.postId}/comment`,
		{ content: data.content },
		{ withCredentials: true },
	);
}
function* addComment(action) {
	// saga도 리액트 처럼 action 데이터를 받아올 수 있음
	// PostCaed.Form의 submit 을 통해 실행된 dispatch로 저장된 액션을 불러올 수 있음
	try {
		const result = yield call(addCommentAPI, action.data);

		yield put({
			type: ADD_COMMENTS_SUCCESS,
			data: {
				postId: action.data.postId,
				comment: result.data,
			},
		});
	} catch (e) {
		console.log(e);
		yield put({
			type: ADD_COMMENTS_FAILURE,
			error: e,
		});
	}
}
function* watchAddComment() {
	yield takeLatest(ADD_COMMENTS_REQUEST, addComment);
}

// 게시물에 달린 댓글 불러오기
function loadCommentsAPI(postId) {
	return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
	try {
		const result = yield call(loadCommentsAPI, action.data);
		yield put({
			type: LOAD_COMMENTS_SUCCESS,
			data: {
				postId: action.data,
				comments: result.data,
			},
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_COMMENTS_FAILURE,
			error: e,
		});
	}
}
function* watchLoadComments() {
	yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

// 이미지 업로드
function uploadImagesAPI(formData) {
	return axios.post('/post/images', formData, {
		withCredentials: true,
	});
}
function* uploadImages(action) {
	try {
		const result = yield call(uploadImagesAPI, action.data);
		yield put({
			type: UPLOAD_IMAGES_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: UPLOAD_IMAGES_FAILURE,
			error: e,
		});
	}
}
function* watchUploadImages() {
	yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

// 좋아요 클릭
function likePostAPI(postId) {
	return axios.post(
		`/post/${postId}/like`,
		{},
		{
			withCredentials: true,
		},
	);
}
function* likePost(action) {
	try {
		const result = yield call(likePostAPI, action.data);
		yield put({
			type: LIKE_POST_SUCCESS,
			data: {
				postId: action.data,
				userId: result.data.userId,
			},
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LIKE_POST_FAILURE,
			error: e,
		});
	}
}
function* watchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}

// 좋아요 취소
function unLikePostAPI(postId) {
	return axios.delete(`/post/${postId}/like`, {
		withCredentials: true,
	});
}
function* unLikePost(action) {
	try {
		const result = yield call(unLikePostAPI, action.data);
		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: {
				postId: action.data,
				userId: result.data.userId,
			},
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: UNLIKE_POST_FAILURE,
			error: e,
		});
	}
}
function* watchUnLikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

// 리트윗
function retweetAPI(postId) {
	return axios.post(
		`/post/${postId}/retweet`,
		{},
		{
			withCredentials: true,
		},
	);
}
function* retweet(action) {
	try {
		const result = yield call(retweetAPI, action.data);
		yield put({
			type: RETWEET_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: RETWEET_FAILURE,
			error: e,
		});
		alert(e.response && e.response.data);
	}
}
function* watchRetweet() {
	yield takeLatest(RETWEET_REQUEST, retweet);
}

// 포스트 삭제
function removePostAPI(postId) {
	return axios.delete(`/post/${postId}`, {
		withCredentials: true,
	});
}
function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.data);
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: result.data,
		});

		yield put({
			type: REMOVE_POST_OF_ME,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: REMOVE_POST_FAILURE,
			error: e,
		});
	}
}
function* watchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

// 포스트 삭제
function loadPostAPI(postId) {
	return axios.get(`/post/${postId}`);
}
function* loadPost(action) {
	try {
		const result = yield call(loadPostAPI, action.data);
		yield put({
			type: LOAD_POST_SUCCESS,
			data: result.data,
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_POST_FAILURE,
			error: e,
		});
	}
}
function* watchLoadPost() {
	yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

export default function* postSaga() {
	yield all([
		fork(watchAddPost),
		fork(watchLoadMainPosts),
		fork(watchAddComment),
		fork(watchLoadComments),
		fork(watchLoadHashtagPosts),
		fork(watchLoadUserPosts),
		fork(watchUploadImages),
		fork(watchLikePost),
		fork(watchUnLikePost),
		fork(watchRetweet),
		fork(watchRemovePost),
		fork(watchLoadPost),
	]);
}
