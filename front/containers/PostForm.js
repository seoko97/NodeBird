import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Input, Button, Form, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
	const dispatch = useDispatch();
	const [text, setText] = useState('');
	const { imagePaths, isAddingPost, postAdded } = useSelector((state) => state.post);
	const imageInput = useRef();

	useEffect(() => {
		setText('');
	}, [postAdded]);

	const onSubmitForm = useCallback(
		(e) => {
			e.preventDefault();

			if (!text || !text.trim()) {
				return alert('게시글을 작성하세요');
			}
			const formData = new FormData();
			imagePaths.forEach((i) => {
				formData.append('image', i);
			});
			formData.append('content', text.trim());

			dispatch({
				type: ADD_POST_REQUEST,
				data: formData,
			});
		},
		[text, imagePaths],
	);

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const onChangeImages = useCallback((e) => {
		// multipart/form-data 에 접근하기 위해 ajax에서 제공하는 FormData메소드에 이미지를 저장한다.
		const imageFormData = new FormData();
		[].forEach.call(e.target.files, (f) => {
			imageFormData.append('image', f);
		});

		dispatch({
			type: UPLOAD_IMAGES_REQUEST,
			data: imageFormData,
		});
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onRemoveImage = useCallback(
		(index) => () => {
			dispatch({
				type: REMOVE_IMAGE,
				index,
			});
		},
		[],
	);

	return (
		<Form
			style={{ margin: '10px 0 20px' }}
			encType="multipart/form-data"
			onSubmit={onSubmitForm}
		>
			<Input.TextArea
				maxLength={140}
				placeholder="어떤일이 있었나요?"
				onChange={onChangeText}
				value={text}
			/>
			<div>
				<input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
				<Button onClick={onClickImageUpload}>
					<Icon type="upload" key="upload" />
					이미지 업로드
				</Button>
				<Button
					type="primary"
					style={{ float: 'right' }}
					htmlType="submit"
					loading={isAddingPost}
				>
					짹짹
				</Button>
			</div>
			<div>
				{imagePaths.map((v, i) => (
					<div key={v} style={{ display: 'inline-block' }}>
						<img
							src={`http://localhost:3065/${v}`}
							style={{ width: '200px', height: '150px' }}
							alt={v}
						/>
						<div>
							<Button onClick={onRemoveImage(i)}>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
