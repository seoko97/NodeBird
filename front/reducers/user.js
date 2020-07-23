//user 정보들
const dummyUser = {
	nickname: '지석호',
	Post: [],
	Followings: [],
	Followers: [],
	signUpData: {},
};

export const initialState = {
	//초기값
	user: null,
	isLoggedIn: false,
};

//액션 이름
export const LOG_IN = 'LOG_IN';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILRE = 'LOG_IN_FAILRE';
export const LOG_OUT = 'LOG_OUT';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';

//액션의 이름에 따라 저장될 정보를 저장
export const loginAction = {
	type: LOG_IN,
};
export const logoutAction = {
	type: LOG_OUT,
};
export const signUpAction = (data) => {
	return { type: SIGN_UP, data: data };
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case LOG_IN: {
			return {
				//새로운 객체를 먼저 생성하고 현재 정보를 불러와 저장
				...state,
				isLoggedIn: true,
				user: dummyUser,
			};
		}
		case LOG_OUT: {
			return {
				//새로운 객체를 먼저 생성하고 현재 정보를 불러와 저장
				...state,
				isLoggedIn: false,
				user: {},
			};
		}
		case SIGN_UP: {
			return {
				...state,
				signUpData: action.data,
			};
		}

		default: {
			return {
				...state,
			};
		}
	}
};

export default reducer;
