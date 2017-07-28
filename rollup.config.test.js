import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'test/test.js',
	format: 'umd',
	globals: {
		tape: 'tape'
	},
	external: ['tape'],
	plugins: [
		resolve({preferBuiltins: false}),
		commonjs()
	],
	dest: 'test/bundle.js',
	sourceMap: true
};
