// function* : 제너레이터, 무한의 개념과 비동기를 표현할 때 사용
// 함수의 실행을 중간에 멈출 수 있음
import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

axios.defaults.baseURL = 'http://localhost:3065/api';

export default function* rootSaga() {
	yield all([call(user), call(post)]);
}
