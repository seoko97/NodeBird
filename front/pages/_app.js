import React from 'react';
import Head from 'next/head';
import AppLayOut from '../component/AppLayout';
import PropTypes from 'prop-types';
import reducer from '../reducers';
import withRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';

const Nodebird = ({ Component }) => {
	return (
		<>
			{/* Provider: 리덕스 스테이스를 리엑트에서 사용하기위한 구문 (store: state, action, reducer 를 합친 것)  */}
			<Head>
				<title>NodeBird</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
				/>
			</Head>
			<AppLayOut>
				<Component />
			</AppLayOut>
		</>
	);
};

Nodebird.propTypes = {
	// PropTypes.node: JSX에 들어가는 모든 것(랜더링 될 수 있는 모든 것)
	// JS를 이용해 타입을 설정 (타입 스클립트 사용시 사용안함)
	// 설정한 타입과 다른 값이 입력될 경우 화면에는 출력되지만 콘솔상에 에러 발생
	Component: PropTypes.elementType,
	store: PropTypes.object,
};

// withRedux를 사용해 기존 컴포넌트의 기능을 향상시킴
// redux Devtools를 사용하기 위해 커스터마이징 진행
export default withRedux((initialState, options) => {
	const middlewares = [];

	// compose: 미들웨어 들을 확장
	const enhancer = compose(
		applyMiddleware(...middlewares),
		typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
			? window.__REDUX_DEVTOOLS_EXTENSION__()
			: (f) => f,
	);
	const store = createStore(reducer, initialState, enhancer);

	//store 커스터 마이징
	return store;
})(Nodebird);
// compose가 여러개의 미들웨어를 합성
// applyMiddleware는 미들웨어를 적용
// 미들웨어는 액션과 스토어 사이에서 작용됨
// 조건문같은경우 리덕스 데브툴즈를 깔으면 윈도우객체로 자동생성됨, 틀 자체는 그냥 외우면됨 거의
