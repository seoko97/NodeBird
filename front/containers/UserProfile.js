import React, { useCallback, useEffect } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
	const { me } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const onLogout = useCallback((e) => {
		dispatch({
			type: LOG_OUT_REQUEST,
		});
	}, []);

	return (
		<Card
			actions={[
				<Link prefetch href="/profile" key="twit">
					<a>
						<div>
							짹짹
							<br />
							{me.Posts.length}
						</div>
					</a>
				</Link>,
				<Link prefetch href="/profile" key="following">
					<a>
						<div>
							팔로잉
							<br />
							{me.Followings.length}
						</div>
					</a>
				</Link>,
				<Link prefetch href="/profile" key="follower">
					<a>
						<div>
							팔로워
							<br />
							{me.Followers.length}
						</div>
					</a>
				</Link>,
			]}
		>
			<Card.Meta
				// avatar: 해당 이름의 첫번째 글짜 title: 닉네임
				avatar={<Avatar>{me.nickname[0]}</Avatar>}
				title={me.nickname}
			/>
			<Button onClick={onLogout}>로그아웃</Button>
		</Card>
	);
};

export default UserProfile;
