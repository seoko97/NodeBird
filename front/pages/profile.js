import React from 'react';
import { Button, List, Card, Icon } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import NicknameEditForm from '../component/NicknameEditForm';

const Profile = () => {
	return (
		<div>
			<NicknameEditForm />
			{/* grid: 아이탬글 간의 간격 조정 */}

			<List
				style={{ marginBottom: '20px' }}
				grid={{ gutter: 4, xs: 2, md: 3 }}
				size="small"
				header={<div>팔로워 목록</div>}
				loadMore={<Button style={{ width: '100%' }}>더보기</Button>}
				bordered
				dataSource={['SH', '바보', '노드버드오피셜']}
				renderItem={(item) => (
					<List.Item style={{ marginTop: '20px' }}>
						{/* JSX 내부에서 배열을 사용하여 태그를 생성할 경우 반드시 키를 입력(반복문) */}
						<Card actions={[<Icon type="stop" key="stop" />]}>
							<Card.Meta description={item} />
						</Card>
					</List.Item>
				)}
			/>

			<List
				style={{ marginBottom: '20px' }}
				grid={{ gutter: 4, xs: 2, md: 3 }}
				size="small"
				header={<div>팔로잉 목록</div>}
				loadMore={<Button style={{ width: '100%' }}>더보기</Button>}
				bordered
				dataSource={['SH', '바보', '노드버드오피셜']}
				renderItem={(item) => (
					<List.Item style={{ marginTop: '20px' }}>
						<Card actions={[<Icon type="stop" key="stop" />]}>
							<Card.Meta description={item} />
						</Card>
					</List.Item>
				)}
			/>
		</div>
	);
};
export default Profile;
