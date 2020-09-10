// {
// 	"parser": "babel-eslint",
// 	"parserOptions": {
// 		"ecmaVersion": 2018,
// 		"sourceType": "module",
// 		"ecmaFeatures": {
// 			"jsx": true
// 		}
// 	},
// 	"env": {
// 		"browser": true,
// 		"node": true,
// 		"es6": true
// 	},
// 	"extents": "airbnb",
// 	"plugins": ["import", "react-hooks"],
// 	"rules": {
// 		"no-underscore-dangle": "off"
// 	}
// }

module.exports = {
	parser: 'babel-eslint',
	plugins: ['react-hooks'],
	extends: [
		'airbnb-base',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:prettier/recommended',
	],
	rules: {
		'no-underscore-dangle': 0,
		'linebreak-style': 0,
		'prettier/prettier': 0,
		'react/forbid-prop-types': 0,
		'no-console': 0,
		'no-unused-vars': 0,
		'import/no-extraneous-dependencies': 0,
		'consistent-return': 0,
		'react/jsx-key': 0,
		'no-undef': 0,
		'no-alert': 0,
		'react/prop-types': 0,
		'import/no-unresolved': 0,
		'import/extensions': 0,
		'jsx-a11y/anchor-is-valid': 0,
		'object-curly-newline': 0,
		'no-unused-expressions': 0,
		'no-fallthrough': 0,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx'],
			},
		},
	},
	globals: {
		document: true,
		foo: true,
		window: true,
	},
};
