import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, Card, Icon } from 'antd';

const FollowList = ({ header, hasMore, onClickMore, data, onClickStop }) => {
	return (
		<List
			style={{ marginBottom: '20px' }}
			grid={{ gutter: 4, xs: 2, md: 3 }}
			size="small"
			header={<div>{header}</div>}
			loadMore={
				hasMore && (
					<Button style={{ width: '100%' }} onClick={onClickMore}>
						더보기
					</Button>
				)
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ marginTop: '20px' }}>
					<Card
						actions={[<Icon type="stop" key="stop" onClick={onClickStop(item.id)} />]}
					>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	hasMore: PropTypes.bool.isRequired,
	onClickMore: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired,
	onClickStop: PropTypes.func.isRequired,
};

export default FollowList;
