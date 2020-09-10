import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import UserProfile from '../containers/UserProfile';
import LoginForm from '../containers/LoginForm';
import Router from 'next/router';

const Applayout = ({ children }) => {
	const { me } = useSelector((state) => state.user);

	const onSearch = (value) => {
		Router.push({ pathname: '/hashtag', query: { tag: value } }, `/hashtag/${value}`);
	};

	return (
		<div>
			<Menu mode="horizontal">
				<Menu.Item key="home">
					<Link prefetch href="/">
						<a>노드버드</a>
					</Link>
				</Menu.Item>
				<Menu.Item key="profile">
					<Link prefetch href={me ? '/profile' : ''}>
						<a>프로필</a>
					</Link>
				</Menu.Item>
				<Menu.Item key="mail">
					<Input.Search
						enterButton
						style={{ verticalAlign: 'middle' }}
						onSearch={onSearch}
					/>
				</Menu.Item>
			</Menu>

			<Row gutter={8}>
				{/* xs: 모바일화면  md: 데스크탑 화면 */}
				{/* 최대 화면의 크기 24 */}
				<Col xs={24} md={6}>
					{/* me가 ture이면(내정보가 있으면) (로그인) 내 정보를 출력, 아니면 로그인창 출력 */}
					{me ? <UserProfile /> : <LoginForm />}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					<Link href="/">
						<a target="_blank" href="/">
							Made by Seokho
						</a>
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
