// function* : 제너레이터, 무한의 개념과 비동기를 표현할 때 사용
import user from './user';
import post from './post';
import { all, call } from 'redux-saga/effects';

export default function* rootSaga() {
	yield all([call(user), call(post)]);
}
