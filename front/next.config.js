const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
	distDir: '.next',
	analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
	analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
	bundleAnalyzerConfig: {
		server: {
			analyzerMode: 'static',
			reportFilename: '../bundles/server.html',
		},
		browser: {
			analyzerMode: 'static',
			reportFilename: '../bundles/client.html',
		},
	},

	webpack(config) {
		console.log(config);
		let prod = process.env.NODE_ENV === 'production';
		const plugins = [
			...config.plugins,
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
			// CompressionPlugin: 파일뒤에 .gz확장자를 붙여 파일을 압축
		];

		if (prod) {
			plugins.push(new CompressionPlugin());
		}

		return {
			...config,

			mode: prod ? 'production' : 'development',
			// hidden-source-map: 소스코드 숨기면서 에러 시 소스맵 제공
			// eval: 빠르게 웹팩 적용
			devtool: prod ? 'hidden-source-map' : 'eval',
			module: {
				...config.module,
				rules: [
					...config.module.rules,
					{
						loader: 'webpack-ant-icon-loader',
						enforce: 'pre',
						include: [require.resolve('@ant-design/icons/lib/dist')],
					},
				],
			},
			plugins,
		};
	},
});
