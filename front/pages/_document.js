import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
	static getInitialProps(context) {
		const sheet = new ServerStyleSheet();

		// document 에서 app.js의 getInitialprops를 실행함
		// 위계관계: document.js > app.js > page/내부 페이지
		const page = context.renderPage((App) => (props) =>
			sheet.collectStyles(<App {...props} />),
		);
		const styleTags = sheet.getStyleElement();
		return { ...page, helmet: Helmet.renderStatic(), styleTags };
	}

	render() {
		const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
		const htmlAttrs = htmlAttributes.toComponent();
		const bodyAttrs = bodyAttributes.toComponent();

		return (
			<html {...htmlAttrs}>
				<head>
					{this.props.styleTags}
					{Object.values(helmet).map((el) => el.toComponent())}
				</head>
				<body {...bodyAttrs}>
					<Main />
					{process.env.NODE_ENV === 'production' && (
						<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
					)}
					<NextScript />
				</body>
			</html>
		);
	}
}

MyDocument.propTypes = {
	helmet: PropTypes.object.isRequired,
	styleTags: PropTypes.object.isRequired,
};

export default MyDocument;
