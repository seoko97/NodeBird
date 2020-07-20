import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Button, Row, Col, Card, Avatar, Form } from 'antd';
import LoginForm from '../component/LoginForm';

//백엔드에서 정보가 넘어오기 전 더미 데이터를 사용해 실제 입력을 진행
const dummy = {
	nickname: '지석호',
	Post: [],
	Followings: [],
	Followers: [],
	isLoggedin: false,
};

const Applayout = ({ children }) => {
	return (
		<div>
			<Menu mode="horizontal">
				<Menu.Item key="home">
					<Link href="/index">
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
					{dummy.isLoggedin ? (
						<Card
							actions={[
								<div key="twit">
									짹짹
									<br />
									{dummy.Post.length}
								</div>,
								<div key="following">
									팔로잉
									<br />
									{dummy.Followings.length}
								</div>,
								<div key="follower">
									팔로워
									<br />
									{dummy.Followers.length}
								</div>,
							]}
						>
							<Card.Meta
								// avatar: 해당 이름의 첫번째 글짜 title: 닉네임
								avatar={<Avatar>{dummy.nickname[0]}</Avatar>}
								title={dummy.nickname}
							/>
						</Card>
					) : (
						<LoginForm />
					)}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}></Col>
			</Row>
		</div>
	);
};

Applayout.PropTypes = {
	children: PropTypes.node,
};

export default Applayout;
