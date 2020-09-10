import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
	return (
		<div>
			{postData.split(/(#[^\s]+)/g).map((v) => {
				if (v.match(/#[^\s]+/)) {
					return (
						<Link
							// href={`/hashtag/${v}.tag}`}: 이 것은 서버주소이기 때문에 페이지가 새로고침됨
							href={{
								pathname: '/hashtag',
								query: { tag: v.slice(1) },
							}}
							as={`/hashtag/${v.slice(1)}`}
							key={v}
						>
							<a>{v}</a>
						</Link>
					);
				}
				return v;
			})}
		</div>
	);
};

PostCardContent.propTypes = {
	postData: PropTypes.string.isRequired,
};

export default PostCardContent;
