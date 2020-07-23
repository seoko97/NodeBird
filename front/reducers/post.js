export const initialState = {
	mainPosts: [
		{
			User: {
				id: 1,
				nickname: 'Sh',
			},
			content: '첫번째 게시글',
			img:
				'http://sunstat.com/wp-content/uploads/2019/01/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C-%EB%B0%B0%EA%B2%BD%EC%9D%B4%EB%AF%B8%EC%A7%80.png',
		},
	],
	imagepaths: [],
};

const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

const addPost = {
	type: ADD_POST,
};

const addDummy = {
	type: ADD_DUMMY,
	data: {
		content: 'Hello',
		UserId: 1,
		user: {
			nickname: 'SH',
		},
	},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_POST: {
			return {
				...state,
			};
		}
		case ADD_DUMMY: {
			return {
				...state,
				mainPosts: [action.data, ...state.mainPosts],
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
