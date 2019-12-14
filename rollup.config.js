import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import Vue from 'rollup-plugin-vue';
import css from 'rollup-plugin-merge-and-inject-css';
import pkg from './package.json';
import minify from 'rollup-plugin-babel-minify';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: process.env.NODE_ENV !== 'production'
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: process.env.NODE_ENV !== 'production'
		},
		{
			file: pkg.umd,
			format: 'umd',
			sourcemap: process.env.NODE_ENV !== 'production',
			name: 'vue-advanced-cropper'
		}
	],
	plugins: [
		external(),
		Vue({
			css: false,
			style: {
				postcssPlugins: [autoprefixer]
			}
		}),
		css({
			id: 'vue-advanced-cropper'
		}),
		url(),
		minify({
			comments: false
		}),
		babel({
			exclude: '/node_modules/**',
			extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
		}),
		resolve(),
		commonjs(),
	]
};
