import React from 'react';
import { Button, Card, Avatar, Icon } from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
	return (
		<Card
			key={+post.createdAt}
			cover={post.img && <img alt="exp" src={post.img} />}
			actions={[
				<div>
					<Icon type="retweet" key="retweet" />
				</div>,
				<div>
					<Icon type="heart" key="heart" />
				</div>,
				<div>
					<Icon type="message" key="messege" />
				</div>,
				<div>
					<Icon type="ellipsis" key="ellipsis" />
				</div>,
			]}
			extra={<Button>팔로우</Button>}
		>
			<Card.Meta
				avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
				title={post.User.nickname}
				description={post.content}
			/>
		</Card>
	);
};

PostCard.propTypes = {
	post: PropTypes.shape({
		User: PropTypes.object,
		content: PropTypes.string,
		img: PropTypes.string,
		createdAt: PropTypes.object,
	}),
};

export default PostCard;
