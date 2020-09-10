import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './imagesZoom/index';

const PostImages = ({ images }) => {
	const [showImagesZoom, setShowImagesZoom] = useState(false);

	const onZoom = useCallback(() => {
		setShowImagesZoom(true);
	}, [showImagesZoom]);

	const onClose = useCallback(() => {
		setShowImagesZoom(false);
	}, [showImagesZoom]);

	// 이미지 한장
	if (images.length === 1) {
		return (
			<>
				<img src={`http://localhost:3065/${images[0].src}`} alt="exp" onClick={onZoom} />
				{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}

	// 이미지 두장 (반반 나눠서 보여줌)
	if (images.length === 2) {
		return (
			<>
				<div>
					<img
						src={`http://localhost:3065/${images[0].src}`}
						alt="exp"
						width="50%"
						onClick={onZoom}
					/>
					<img
						src={`http://localhost:3065/${images[1].src}`}
						alt="exp"
						width="50%"
						onClick={onZoom}
					/>
				</div>
				{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}

	// 이미지 세장 (더보기버튼 생성)
	return (
		<>
			<div>
				<img
					src={`http://localhost:3065/${images[0].src}`}
					alt="exp"
					width="50%"
					onClick={onZoom}
				/>
				<div
					style={{
						display: 'inline-block',
						width: '50%',
						textAlign: 'center',
						verticalAlign: 'middle',
						backgroundImage: `http://localhost:3065/${images[1].src}`,
					}}
					onClick={onZoom}
				>
					<Icon type="plus" />
					<br />
					{images.length - 1}
					개의 사진 더보기
				</div>
			</div>
			{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
		</>
	);
};

PostImages.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string,
		}),
	).isRequired,
};

export default PostImages;
