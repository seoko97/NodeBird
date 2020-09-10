import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Overlay, CloseButton, SlickWrapper, ImageWrapper, Indicator, Header } from './style';

const ImagesZoom = ({ images, onClose }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	return (
		<Overlay>
			<Header>
				<h1>상세 이미지</h1>
				<CloseButton type="close" onClick={onClose} />
			</Header>
			<SlickWrapper>
				<div>
					<Slick
						// 몇번째 이미지
						initialSlide={0}
						afterChange={(slide) => setCurrentSlide(slide)}
						infinite={false}
						arrows
						slidesToShow={1}
						slidesToScroll={1}
					>
						{images.map((v, i) => {
							return (
								<ImageWrapper key={images[i].src}>
									<img src={`http://localhost:3065/${v.src}`} alt="exp" />
								</ImageWrapper>
							);
						})}
					</Slick>
					<Indicator style={{ textAlign: 'center' }}>
						<div>
							{currentSlide + 1} / {images.length}
						</div>
					</Indicator>
				</div>
			</SlickWrapper>
		</Overlay>
	);
};

ImagesZoom.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string,
		}),
	).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
