import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import sass from 'rollup-plugin-sass';
import Vue from 'rollup-plugin-vue';
import css from 'rollup-plugin-merge-and-inject-css'
import pkg from './package.json';

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
		css({
			id: 'vue-advanced-cropper'
		}),
		Vue({
			css: false,
		}),
		postcss({
			inject: false
		}),
		url(),
		babel({
			exclude: 'node_modules/**',
		}),
		resolve(),
		commonjs(),
	]
}
