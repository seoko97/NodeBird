import React from 'react';
import Form from 'antd/lib/form/Form';
import { Input, Button, Card, Avatar } from 'antd';
import {
	RetweetOutlined,
	HeartOutlined,
	EllipsisOutlined,
	MessageOutlined,
} from '@ant-design/icons';

const dummy = {
	isLoggedIn: false,
	imagepaths: [],
	mainPosts: [
		{
			User: {
				id: 1,
				nickname: 'Sh',
			},
			content: '첫번째 게시글',
			img:
				'http://sunstat.com/wp-content/uploads/2019/01/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C-%EB%B0%B0%EA%B2%BD%EC%9D%B4%EB%AF%B8%EC%A7%80.png',
		},
	],
};

const Home = () => {
	return (
		<div>
			{dummy.isLoggedIn && (
				<Form encType="multipart/form-data" style={{ marginBottom: '20px' }}>
					<Input.TextArea maxLength={140} placeholder="어떤일이 있었나요?" />
					<div>
						<input type="file" multiple hidden />
						<Button>이미지 업로드</Button>
						<Button type="primary" style={{ float: 'right' }} htmlType="submit">
							짹짹
						</Button>
					</div>
					<div>
						{dummy.imagepaths.map((v, i) => {
							return (
								<div key={v} style={{ display: 'inline-block' }}>
									<img
										src={'http://localhost:3000/' + v}
										style={{ width: '200px' }}
										alt={v}
									/>
									<div>
										<Button>제거</Button>
									</div>
								</div>
							);
						})}
					</div>
				</Form>
			)}
			{dummy.mainPosts.map((c) => {
				return (
					<Card
						key={+c.createdAt}
						cover={c.img && <img alt="exp" src={c.img} />}
						actions={[
							<div>
								<RetweetOutlined key="RetweetOutlined" />
							</div>,
							<div>
								<HeartOutlined key="HeartOutlined " />
							</div>,
							<div>
								<MessageOutlined key="MessageOutlined" />
							</div>,
							<div>
								<EllipsisOutlined key="EllipsisOutlined " />
							</div>,
						]}
						extra={<Button>팔로우</Button>}
					>
						<Card.Meta
							avatar={<Avatar>{c.User.nickname[0]}</Avatar>}
							title={c.User.nickname}
							description={c.content}
						/>
					</Card>
				);
			})}
		</div>
	);
};
export default Home;
