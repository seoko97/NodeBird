import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
	const { mainPosts, hasMorePost } = useSelector((state) => state.post);
	const dispatch = useDispatch();
	const countRef = useRef([]);

	const onScroll = useCallback(() => {
		// scrollY: 현재 위치
		// clientHeight : 화면 높이
		// scrollHeight: 전체 화면 길이 (scrollY + clientHeight)
		if (
			window.scrollY + document.documentElement.clientHeight >
			document.documentElement.scrollHeight - 50
		) {
			if (hasMorePost) {
				const lastId = mainPosts[mainPosts.length - 1].id;

				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: LOAD_HASHTAG_POSTS_REQUEST,
						lastId: mainPosts[mainPosts.length - 1] && lastId,
						data: tag,
					});
					countRef.current.push(lastId);
				}
			}
		}
	}, [mainPosts.length, hasMorePost]);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [mainPosts.length]);

	return (
		<div>
			{mainPosts.map((c) => {
				return <PostCard key={c.id} post={c} />;
			})}
		</div>
	);
};

Hashtag.propTypes = {
	tag: PropTypes.string.isRequired,
};

Hashtag.getInitialProps = async (context) => {
	const tag = context.query.tag;

	context.store.dispatch({
		type: LOAD_HASHTAG_POSTS_REQUEST,
		data: tag,
	});
	return { tag };
};

export default Hashtag;
