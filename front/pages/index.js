import React, { useEffect } from 'react';
import PostForm from '../component/PostForm';
import PostCard from '../component/PostCard';
import { useSelector } from 'react-redux';

const Home = () => {
	const user = useSelector((state) => state.user.user);
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	const { mainPosts } = useSelector((state) => state.post);

	return (
		<div>
			{isLoggedIn ? (
				<div>로그인 했습니다: {user.nickname}</div>
			) : (
				<div>로그아웃 했습니다.</div>
			)}
			{isLoggedIn && <PostForm />}
			{mainPosts.map((c) => {
				return <PostCard key={c} post={c} />;
			})}
		</div>
	);
};

export default Home;
