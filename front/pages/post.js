import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post = ({ id }) => {
	const { singlePost } = useSelector((state) => state.post);

	return (
		<>
			<Helmet
				title={`${singlePost.User.nickname}님의 글`}
				description={singlePost.content}
				meta={[
					{
						name: 'description',
						content: singlePost.content,
					},
					{
						// og: 오픈 그래프
						property: 'og:title',
						content: `${singlePost.User.nickname}님의 게시글`,
					},
					{
						property: 'og:description',
						content: singlePost.content,
					},
					{
						property: 'og:image',
						content:
							singlePost.Images[0] &&
							`http://localhost3065/${singlePost.Images[0].src}`,
					},
					{
						property: 'og:url',
						content: `http://localhost3065/post/${id}`,
					},
				]}
			/>
			<div>{singlePost.content}</div>
			<div>{singlePost.User.nickname}</div>
			<div>
				{singlePost.Images[0] && (
					<img src={`http://localhost:3065/${singlePost.Images[0].src}`} />
				)}
			</div>
		</>
	);
};
Post.propTypes = {
	id: PropTypes.number.isRequired,
};

Post.getInitialProps = async (context) => {
	context.store.dispatch({
		type: LOAD_POST_REQUEST,
		data: context.query.id,
	});

	return { id: parseInt(context.query.id, 10) };
};

export default Post;
