import autoprefixer from 'autoprefixer';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: process.env.NODE_ENV !== 'production',
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: process.env.NODE_ENV !== 'production',
		},
		{
			file: pkg.umd,
			format: 'umd',
			sourcemap: process.env.NODE_ENV !== 'production',
			name: 'vue-advanced-cropper',
		},
	],
	plugins: [
		external(),
		scss({
			output: './dist/style.css',
		}),
		vue({
			css: false,
			style: {
				postcssPlugins: [autoprefixer],
			},
		}),
		url(),
		babel({
			exclude: '/node_modules/**',
			extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
		}),
		resolve(),
		commonjs(),
		terser(),
		typescript(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
	],
};
