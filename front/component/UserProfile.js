import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector } from 'react-redux';
import { logoutAction } from '../reducers/user';
import { useDispatch } from 'react-redux';

const UserProfile = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const onLogout = useCallback((e) => {
		dispatch(logoutAction);
	}, []);

	return (
		<Card
			actions={[
				<div key="twit">
					짹짹
					<br />
					{user.Post.length}
				</div>,
				<div key="following">
					팔로잉
					<br />
					{user.Followings.length}
				</div>,
				<div key="follower">
					팔로워
					<br />
					{user.Followers.length}
				</div>,
			]}
		>
			<Card.Meta
				// avatar: 해당 이름의 첫번째 글짜 title: 닉네임
				avatar={<Avatar>{user.nickname[0]}</Avatar>}
				title={user.nickname}
			/>
			<Button onClick={onLogout}>로그아웃</Button>
		</Card>
	);
};

export default UserProfile;
