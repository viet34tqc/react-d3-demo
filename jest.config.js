module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.json',
		},
	},
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	setupFilesAfterEnv: ['./jest.setup.ts'],
	moduleNameMapper: {
		d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
	},
	//transformIgnorePatterns: ['/node_modules/(?!d3-(array|format|scale))'],
	coverageThreshold: {
		global: {
			branches: 100,
			lines: 100,
			statements: 100,
		},
	},
};
