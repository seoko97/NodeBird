import React from 'react';
import Head from 'next/head';
import AppLayOut from '../component/AppLayout';
import PropTypes from 'prop-types';

const Nodebird = ({ Component }) => {
	return (
		<>
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

Nodebird.PropTypes = {
	// PropTypes.node: JSX에 들어가는 모든 것(랜더링 될 수 있는 모든 것)
	// JS를 이용해 타입을 설정 (타입 스클립트 사용시 사용안함)
	// 설정한 타입과 다른 값이 입력될 경우 화면에는 출력되지만 콘솔상에 에러 발생
	Component: PropTypes.elementType,
};

export default Nodebird;
