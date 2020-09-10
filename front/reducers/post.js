import produce from 'immer';

export const initialState = {
	mainPosts: [], // 화면에 보일 포스트들
	imagePaths: [], // 미리보기 이미지 경로
	addPostErrorReason: false, // 포스트 업로드 실패 사유
	isAddingPost: false, // 포스트 업로드 중
	postAdded: false, // 포스트 업로드 성공

	isAddingComment: false, // 댓글 업로드 중
	commentAdded: false, // 댓글 업로드 성공
	addCommentErrorReason: '', // 댓글 업로드 실패 사유
	singlePost: null,
};

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_IMAGES_POSTS_REQUEST = 'LOAD_IMAGES_POSTS_REQUEST';
export const LOAD_IMAGES_POSTS_SUCCESS = 'LOAD_IMAGES_POSTS_SUCCESS';
export const LOAD_IMAGES_POSTS_FAILURE = 'LOAD_IMAGES_POSTS_FAILURE';

// 동기 요청////////////////////////
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENTS_REQUEST = 'ADD_COMMENTS_REQUEST';
export const ADD_COMMENTS_SUCCESS = 'ADD_COMMENTS_SUCCESS';
export const ADD_COMMENTS_FAILURE = 'ADD_COMMENTS_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export default (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			// 이미지 업로드
			case UPLOAD_IMAGES_REQUEST: {
				break;
			}
			case UPLOAD_IMAGES_SUCCESS: {
				action.data.forEach((p) => {
					draft.imagePaths.push(p);
				});
				break;
			}
			case UPLOAD_IMAGES_FAILURE: {
				break;
			}

			case REMOVE_IMAGE: {
				const index = draft.imagePaths.findIndex((v, i) => i === action.index);
				draft.imagePaths.splice(index, 1);
				break;
			}

			// 게시글 정보 저장
			case ADD_POST_REQUEST: {
				draft.isAddingPost = true;
				draft.addPostErrorReason = '';
				draft.postAdded = false;
				break;
			}
			case ADD_POST_SUCCESS: {
				draft.isAddingPost = false;
				// 기존 포스트 앞쪽에 생성된 포스트 저장
				draft.mainPosts.unshift(action.data);
				draft.postAdded = true;
				draft.imagePaths = [];
				break;
			}
			case ADD_POST_FAILURE: {
				draft.isAddingPost = false;
				draft.addPostErrorReason = action.error;
				break;
			}

			// 댓글 정보 저장
			case ADD_COMMENTS_REQUEST: {
				draft.isAddingComment = true;
				draft.addCommentErrorReason = '';
				draft.commentAdded = false;
				break;
			}
			case ADD_COMMENTS_SUCCESS: {
				// draft 를 통해 기존에 있던 게시글에서 입력된 data값에 저장된 id 값과 같은 게시글 검색
				const postIndex = draft.mainPosts.findIndex((v) => v.id === action.data.postId);
				draft.mainPosts[postIndex].Comments.push(action.data.comment);
				draft.isAddingComment = false;
				draft.commentAdded = true;
				break;
			}
			case ADD_COMMENTS_FAILURE: {
				draft.isAddingComment = false;
				draft.addCommentErrorReason = action.error;
				break;
			}

			case LOAD_COMMENTS_SUCCESS: {
				const postIndex = draft.mainPosts.findIndex((v) => v.id === action.data.postId);
				draft.mainPosts[postIndex].Comments = action.data.comments;
				break;
			}

			// 게시글 불러오기
			case LOAD_MAIN_POSTS_REQUEST:
			// 다른 유저 게시글 불러오기
			case LOAD_USER_POSTS_REQUEST:
			// 해당 해시태그 게시글 불러오기
			case LOAD_HASHTAG_POSTS_REQUEST: {
				draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
				draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
				break;
			}
			case LOAD_MAIN_POSTS_SUCCESS:
			case LOAD_USER_POSTS_SUCCESS:
			case LOAD_HASHTAG_POSTS_SUCCESS: {
				action.data.forEach((d) => {
					draft.mainPosts.push(d);
				});
				draft.hasMorePost = action.data.length === 10;
				break;
			}
			case LOAD_MAIN_POSTS_FAILURE:
			case LOAD_USER_POSTS_FAILURE:
			case LOAD_HASHTAG_POSTS_FAILURE: {
				break;
			}

			// 좋아요
			case LIKE_POST_REQUEST: {
				break;
			}
			case LIKE_POST_SUCCESS: {
				const postIndex = draft.mainPosts.findIndex((v) => v.id === action.data.postId);
				draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
				break;
			}
			case LIKE_POST_FAILURE: {
				break;
			}

			// 좋아요 취소
			case UNLIKE_POST_REQUEST: {
				break;
			}
			case UNLIKE_POST_SUCCESS: {
				const postIndex = draft.mainPosts.findIndex((v) => v.id === action.data.postId);
				const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(
					(v) => v.id === action.data.userId,
				);
				draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
				break;
			}
			case UNLIKE_POST_FAILURE: {
				break;
			}

			// 리트윗
			case RETWEET_REQUEST: {
				break;
			}
			case RETWEET_SUCCESS: {
				draft.mainPosts.unshift(action.data);
				break;
			}
			case RETWEET_FAILURE: {
				break;
			}

			// 포스트 삭제
			case REMOVE_POST_REQUEST: {
				break;
			}
			case REMOVE_POST_SUCCESS: {
				const index = draft.mainPosts.filter((v) => v.id === action.data);
				draft.mainPosts.splice(index, 1);
				break;
			}
			case REMOVE_POST_FAILURE: {
				break;
			}
			case LOAD_POST_SUCCESS: {
				draft.singlePost = action.data;
				break;
			}
			default: {
				break;
			}
		}
	});
};
