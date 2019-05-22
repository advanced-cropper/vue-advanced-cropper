import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import sass from 'rollup-plugin-sass';
import Vue from 'rollup-plugin-vue';
import pkg from './package.json';

const testPlugin = {
	name: 'my-example', // this name will show up in warnings and errors
	transform: (code, id) => {
		console.log('ID', id, 'CODE', code)
		return '';
	},
	generateBundle: (opts, rendered) => {
		// console.log('opts', opts, 'rendered', rendered)
	}
}

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		external(),
		Vue({
			// Temporary solution
			styleInjector: '~vue-style-injector/browser'
		}),
		sass(),
		postcss(),
		// testPlugin,
		url(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		}),
		resolve(),
		commonjs()
	]
}
