import React, { useState, useCallback, memo } from 'react';
import { Button, Card, Avatar, Icon, List, Comment, Popover } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment';

import {
	LOAD_COMMENTS_REQUEST,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST,
	RETWEET_REQUEST,
	REMOVE_POST_REQUEST,
} from '../reducers/post';
import PostImages from '../component/PostImages';
import PostCardContent from '../component/PostCardContent';
import FollowButton from '../component/FollowButton';

import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import CommentForm from './CommentForm';

moment.locale('ko');

const CardWrapper = styled.div`
	margin-bottom: 20px;
`;

const PostCard = memo(({ post }) => {
	const [commentFormOpened, setCommentFormopened] = useState(false);
	const id = useSelector((state) => state.user.me && state.user.me.id);
	const dispatch = useDispatch();

	const liked = id && post.Likers && post.Likers.find((v) => v.id);

	const onToggleComment = useCallback(() => {
		setCommentFormopened((prev) => !prev);
		if (!commentFormOpened) {
			dispatch({
				type: LOAD_COMMENTS_REQUEST,
				data: post.id,
			});
		}
	}, []);

	// 좋아요 버튼 클릭
	const onToggleLike = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}

		if (liked) {
			// 좋아요를 누른 상태
			return dispatch({
				type: UNLIKE_POST_REQUEST,
				data: post.id,
			});
		} else {
			// 좋아요를 안 누른 상태
			return dispatch({
				type: LIKE_POST_REQUEST,
				data: post.id,
			});
		}
	}, [id, post, liked]);

	const onRetweet = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: RETWEET_REQUEST,
			data: post.id,
		});
	}, [id, post.id]);

	const onFollow = useCallback(
		(userId) => () => {
			dispatch({
				type: FOLLOW_USER_REQUEST,
				data: userId,
			});
		},
		[],
	);
	const onUnFollow = useCallback(
		(userId) => () => {
			dispatch({
				type: UNFOLLOW_USER_REQUEST,
				data: userId,
			});
		},
		[],
	);

	const onRemovePost = useCallback(
		(userId) => () => {
			dispatch({
				type: REMOVE_POST_REQUEST,
				data: userId,
			});
		},
		[],
	);

	return (
		<CardWrapper>
			<Card
				cover={
					post.Images &&
					post.Images[0] && (
						<PostImages images={post.Images} key={'image: ' + post.createdAt} />
					)
				}
				actions={[
					<Icon type="retweet" key="retweet" onClick={onRetweet} />,
					<Icon
						type="heart"
						key="heart"
						theme={liked ? 'twoTone' : 'outlined'}
						twoToneColor="#eb2f96"
						onClick={onToggleLike}
					/>,
					<Icon type="message" key="messege" onClick={onToggleComment} />,
					<Popover
						key="ellipsis"
						content={
							<Button.Group>
								{post.UserId == id ? (
									<>
										<Button>수정</Button>
										<Button type="danger" onClick={onRemovePost(post.id)}>
											삭제
										</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}
					>
						<Icon type="ellipsis" key="ellipsis" />
					</Popover>,
				]}
				title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
				extra={<FollowButton post={post} onUnFollow={onUnFollow} onFollow={onFollow} />}
			>
				{post.RetweetId && post.Retweet ? (
					<Card
						cover={
							post.Retweet.Images &&
							post.Retweet.Images[0] && (
								<PostImages
									images={post.Retweet.Images}
									key={'retweetImage: ' + post.createdAt}
								/>
							)
						}
					>
						<Card.Meta
							avatar={
								<Link
									href={{
										pathname: '/user',
										query: { id: post.Retweet.User.id },
									}}
									as={`/user/${post.Retweet.User.id}`}
								>
									<a>
										<Avatar>{post.Retweet.User.nickname[0]}</Avatar>
									</a>
								</Link>
							}
							title={post.Retweet.User.nickname}
							description={<PostCardContent postData={post.Retweet.content} />} // a tag => Lick
						/>
						{moment(post.createdAt).format('YYYY.MM.DD.')}
					</Card>
				) : (
					<Card.Meta
						avatar={
							<Link
								href={{
									pathname: '/user',
									query: { id: post.User.id },
								}}
								as={`/user/${post.User.id}`}
							>
								<a>
									<Avatar>{post.User.nickname[0]}</Avatar>
								</a>
							</Link>
						}
						title={post.User.nickname}
						description={<PostCardContent postData={post.content} />} // a tag => Lick
					/>
				)}
			</Card>
			{commentFormOpened && (
				<>
					<CommentForm post={post} />
					<List
						header={`${post.Comments ? post.Comments.length : 0} 댓글`}
						itemLayout="horizontal"
						dataSource={post.Comments || []}
						renderItem={(item) => (
							<li style={{ listStyle: 'none' }}>
								<Comment
									author={item.User.nickname}
									avatar={
										<Link
											href={{
												pathname: '/user',
												query: { id: item.User.id },
											}}
											as={`/user/${item.User.id}`}
										>
											<a>
												<Avatar>{item.User.nickname[0]}</Avatar>
											</a>
										</Link>
									}
									content={item.content}
									// datetime에는 객체를 넘겨줄 수 없다. 따라서 배열이나 문자열로 변환시켜 저장한다.
									datetime={String(item.createdAt).substr(0, 21)}
								/>
							</li>
						)}
					/>
				</>
			)}
		</CardWrapper>
	);
});

PostCard.propTypes = {
	post: PropTypes.shape({
		User: PropTypes.object,
		content: PropTypes.string,
		img: PropTypes.string,
		createdAt: PropTypes.string,
	}).isRequired,
};

export default PostCard;
