// 부모 리듀서
// 흩어진 모든 리듀서들을 하나로 합쳐줌
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const rootReducer = combineReducers({
	user,
	post,
});

export default rootReducer;
