import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import createSagaMiddleware from 'redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { Container } from 'next/app';
import AppLayOut from '../component/AppLayout';
import reducer from '../reducers';
import rootSaga from '../saga';
import { LOAD_USER_REQUEST } from '../reducers/user';

const Nodebird = ({ Component, store, pageProps }) => {
	return (
		<>
			{/* Provider: 리덕스 스테이스를 리엑트에서 사용하기위한 구문 (store: state, action, reducer 를 합친 것)  */}
			<Container>
				<Provider store={store}>
					<Helmet
						title="NodeBird"
						htmlAttributes={{ lang: 'ko' }}
						mata={[
							{
								charset: 'UTF-8',
							},
							{
								name: 'viewport',
								content:
									'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
							},
							{
								'http-equiv': 'X-UA-Compatible',
								content: 'IE=edge',
							},
							{
								name: 'description',
								content: 'SeokHo의 NodeBird SNS',
							},
							{
								name: 'og:title',
								content: 'NodeBird',
							},
							{
								name: 'og:description',
								content: 'SeokHo의 NodeBird SNS',
							},
							{
								property: 'og:type',
								content: 'website',
							},
							{
								property: 'og:image',
								content: 'http://localhost:3060/favicon.ico',
							},
						]}
						link={[
							{
								rel: 'shortcut icon',
								href: '/favicon.ico',
							},
							{
								rel: 'stylesheet',
								href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
							},
							{
								rel: 'stylesheet',
								href:
									'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
							},
							{
								rel: 'stylesheet',
								href:
									'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
							},
						]}
					/>
					<AppLayOut>
						<Component {...pageProps} />
					</AppLayOut>
				</Provider>
			</Container>
		</>
	);
};

Nodebird.propTypes = {
	// PropTypes.node: JSX에 들어가는 모든 것(랜더링 될 수 있는 모든 것)
	// JS를 이용해 타입을 설정 (타입 스클립트 사용시 사용안함)
	// 설정한 타입과 다른 값이 입력될 경우 화면에는 출력되지만 콘솔상에 에러 발생
	Component: PropTypes.elementType.isRequired,
	store: PropTypes.object.isRequired,
	pageProps: PropTypes.object.isRequired,
};

Nodebird.getInitialProps = async (context) => {
	const { ctx, Component } = context;
	let pageProps = {};

	// 순서가 중요 먼저 데이터를 받아 오고 사가를 실행
	const state = ctx.store.getState();

	// CSR 에서는 브라우저가 서버쪽에 쿠키를 전송하지만
	// SSR 에서는 브라우저가 존재하지 않기 때문에 직접 쿠키를 받아와 서버에 전송한다.
	const cookie = ctx.isServer ? ctx.req.headers.cookie : '';

	// isServer 가 true인 경우 SSR 환경 = 쿠키를 직접 집어 넣아 줘야 함
	if (ctx.isServer && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}

	if (!state.user.me) {
		ctx.store.dispatch({
			type: LOAD_USER_REQUEST,
		});
	}

	// 받은 데이터를 pageProps로 넘겨줌
	if (Component.getInitialProps) {
		pageProps = (await Component.getInitialProps(ctx)) || {};
	}

	// 컴포넌트의 props
	return { pageProps };
};

// middleware 만드는 방법 (currying 기법: 인자 하나를 받아 다른 함수를 리턴) 3단 커링
// const middleware = (store) => (next) => (action) => {
// 	next(action);
// };

// withRedux를 사용해 기존 컴포넌트의 기능을 향상시킴
// redux Devtools를 사용하기 위해 커스터마이징 진행

const configureStore = (initialState) => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [
		sagaMiddleware,
		(store) => (next) => (action) => {
			next(action);
		},
	];

	// compose: 미들웨어 들을 확장
	const enhancer =
		process.env.NODE_ENV === 'production'
			? compose(applyMiddleware(...middlewares))
			: compose(
					applyMiddleware(...middlewares),
					typeof window !== 'undefined' &&
						typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
						? window.__REDUX_DEVTOOLS_EXTENSION__()
						: (f) => f,
			  );
	const store = createStore(reducer, initialState, enhancer);
	store.sagaTask = sagaMiddleware.run(rootSaga);

	// store 커스터 마이징
	return store;
};

export default withRedux(configureStore)(withReduxSaga(Nodebird));

// compose가 여러개의 미들웨어를 합성
// applyMiddleware는 미들웨어를 적용
// 미들웨어는 액션과 스토어 사이에서 작용됨
// 조건문같은경우 리덕스 데브툴즈를 깔면 윈도우객체로 자동생성됨, 틀 자체는 그냥 외우면됨 거의
