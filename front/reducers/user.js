import produce from 'immer';

// user 정보들
export const initialState = {
	// 초기값
	isLoggingIn: false, // 로그인 시도중
	logInErrorReason: '', // 로그인 실패 사유

	isLoggingOut: false, // 로그아웃 시도중

	signUp: false, // 회원가입 성공
	isSigningUp: false, // 회원 가입 시도중
	isSignedUp: false,
	signUpErrorReaon: '', // 회원가입 실패 사유

	me: null, // 내정보
	followingList: [], // 팔로잉 리스트
	followerList: [], // 팔로워 리스트
	userInfo: null, // 남의 정보

	isEditingNickname: false, // 닉네임 변경중
	editNicknameErrorReason: '', // 닉네임 변경 실패 사유
	hasMoreFollower: false,
	hasMoreFollowing: false,
};

// 액션 이름
// 비동기 요청에 경우 해당 이름을 사용하자 (REQUEST, SUCCESS, FAILURE)
// 동기요청은 바로 실행되기 때문에 해당 단어를 사용하지 말자
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export default (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			// 로그인 요청
			case LOG_IN_REQUEST: {
				draft.isLoggingIn = true;
				draft.logInErrorReason = '';
				break;
			}
			case LOG_IN_SUCCESS: {
				draft.isLoggingIn = false;
				draft.me = action.data;
				draft.logInErrorReason = '';
				break;
			}
			case LOG_IN_FAILURE: {
				draft.isLoggingIn = false;
				draft.logInErrorReason = action.reason;
				draft.me = null;
				break;
			}

			// 로그아웃 요청
			case LOG_OUT_REQUEST: {
				draft.isLoggingOut = true;
				break;
			}
			case LOG_OUT_SUCCESS: {
				draft.isLoggingOut = false;
				draft.me = null;
				break;
			}

			// 회원가입 요청
			case SIGN_UP_REQUEST: {
				draft.isSignedUp = false;
				draft.isSigningUp = true;
				draft.signUpErrorReaon = '';
				break;
			}
			case SIGN_UP_SUCCESS: {
				draft.isSignedUp = true;
				draft.isSigningUp = false;
				break;
			}
			case SIGN_UP_FAILURE: {
				draft.isSigningUp = false;
				draft.signUpErrorReaon = action.error;
				break;
			}

			// 포스트 불러오기 요청
			case LOAD_USER_REQUEST: {
				break;
			}
			case LOAD_USER_SUCCESS: {
				if (action.me) {
					draft.me = action.data;
					break;
				}
				draft.userInfo = action.data;
				break;
			}
			case LOAD_USER_FAILURE: {
				break;
			}

			// 팔로우
			case FOLLOW_USER_REQUEST: {
				break;
			}
			case FOLLOW_USER_SUCCESS: {
				draft.me.Followings.unshift({ id: action.data });
				break;
			}
			case FOLLOW_USER_FAILURE: {
				break;
			}

			// 언팔로우
			case UNFOLLOW_USER_REQUEST: {
				break;
			}
			case UNFOLLOW_USER_SUCCESS: {
				const index = draft.me.Followings.findIndex((v) => v.id === action.data);
				draft.me.Followings.splice(index, 1);
				const index2 = draft.followingList.findIndex((v) => v.id === action.data);
				draft.followingList.splice(index2, 1);
				break;
			}
			case UNFOLLOW_USER_FAILURE: {
				break;
			}

			// 포스트 정보 가져오기
			case ADD_POST_TO_ME: {
				draft.me.Posts.unshift({ id: action.data });
				break;
			}

			// 포스트 정보 변경(삭제)
			case REMOVE_POST_OF_ME: {
				const index = draft.me.Posts.findIndex((v) => v.id === action.data);
				draft.me.Posts.splice(index, 1);
				break;
			}

			// 내 팔로워 목록 불러우기
			case LOAD_FOLLOWERS_REQUEST: {
				draft.followerList = !action.offset ? [] : draft.followerList;
				draft.hasMoreFollower = action.offset ? draft.hasMoreFollower : true;
				break;
			}
			case LOAD_FOLLOWERS_SUCCESS: {
				action.data.forEach((d) => {
					draft.followerList.push(d);
				});
				draft.hasMoreFollower = action.data.length === 3;
				break;
			}
			case LOAD_FOLLOWERS_FAILURE: {
				break;
			}

			// 날 팔로잉한 유저 불러오기
			case LOAD_FOLLOWINGS_REQUEST: {
				draft.followingList = !action.offset ? [] : draft.followingList;
				draft.hasMoreFollowing = action.offset ? draft.hasMoreFollowing : true; // 처음 데이터를 가져올 때는 더보기 버튼을 보여주는 걸로
				break;
			}
			case LOAD_FOLLOWINGS_SUCCESS: {
				action.data.forEach((d) => {
					draft.followingList.push(d);
				});
				draft.hasMoreFollowing = action.data.length === 3;
				break;
			}
			case LOAD_FOLLOWINGS_FAILURE: {
				break;
			}

			// 팔로워 삭제하기
			case REMOVE_FOLLOWER_REQUEST: {
				break;
			}
			case REMOVE_FOLLOWER_SUCCESS: {
				const index = draft.me.Followers.findIndex((v) => v.id === action.data);
				draft.me.Followers.splice(index, 1);
				const index2 = draft.followerList.findIndex((v) => v.id === action.data);
				draft.followerList.splice(index2, 1);
				break;
			}
			case REMOVE_FOLLOWER_FAILURE: {
				break;
			}

			// 닉네임 변경
			case EDIT_NICKNAME_REQUEST: {
				draft.isEditingNickname = true;
				draft.editNicknameErrorReason = '';
				break;
			}
			case EDIT_NICKNAME_SUCCESS: {
				draft.isEditingNickname = false;
				draft.me.nickname = action.data;
				break;
			}
			case EDIT_NICKNAME_FAILURE: {
				draft.isEditingNickname = false;
				draft.editNicknameErrorReason = action.error;
				break;
			}

			default: {
				break;
			}
		}
	});
};
