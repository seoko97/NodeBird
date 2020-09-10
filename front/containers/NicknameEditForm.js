import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';
import { useInput } from '../pages/signup';

const NicknameEditForm = () => {
	const dispatch = useDispatch();
	const [editedName, setEditedname] = useInput('');

	const { me } = useSelector((state) => state.user);

	const onchangeNickname = useCallback(
		(e) => {
			e.preventDefault();

			if (editedName !== '') {
				dispatch({
					type: EDIT_NICKNAME_REQUEST,
					data: editedName,
				});
			}
		},
		[editedName],
	);

	return (
		<Form
			style={{
				marginBottom: '20px',
				border: '1px solid #d9d9d9',
				padding: '20px',
				display: 'flex',
			}}
		>
			<Input
				addonBefore="닉네임"
				value={editedName || (me && me.nickname)}
				onChange={setEditedname}
			/>
			<Button type="primary" htmlType="submit" onClick={onchangeNickname}>
				수정
			</Button>
		</Form>
	);
};

export default NicknameEditForm;
