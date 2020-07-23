import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import UserProfile from '../component/UserProfile';
import LoginForm from '../component/LoginForm';

const Applayout = ({ children }) => {
	const { isLoggedIn } = useSelector((state) => state.user);

	return (
		<div>
			<Menu mode="horizontal">
				<Menu.Item key="home">
					<Link href="/">
						<a>노드버드</a>
					</Link>
				</Menu.Item>
				<Menu.Item key="profile">
					<Link href="/profile">
						<a>프로필</a>
					</Link>
				</Menu.Item>
				<Menu.Item key="mail">
					<Input.Search enterButton style={{ verticalAlign: 'middle' }} />
				</Menu.Item>
			</Menu>

			<Row gutter={8}>
				{/* xs: 모바일화면  md: 데스크탑 화면 */}
				{/* 최대 화면의 크기 24 */}
				<Col xs={24} md={6}>
					{/* dummy.isLoggedin가 ture이면 (로그인) 내 정보를 출력, 아니면 로그인창 출력 */}
					{isLoggedIn ? <UserProfile /> : <LoginForm />}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					<Link href="#">
						<a target="_blank">Made by Seokho</a>
					</Link>
				</Col>
			</Row>
		</div>
	);
};

Applayout.propTypes = {
	children: PropTypes.node,
};

export default Applayout;
