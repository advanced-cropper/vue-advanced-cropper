import autoprefixer from 'autoprefixer';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const output = [
	{
		file: pkg.module,
		format: `es`,
	},
	{
		file: pkg.main,
		format: `cjs`,
	},
	{
		file: pkg.unpkg,
		format: `iife`,
	},
	{
		file: pkg.browser || pkg.module.replace('bundler', 'browser'),
		format: `es`,
	},
];

export default {
	external: ['vue'],
	input: 'src/index.js',
	output: output.map((config) => ({
		...config,
		name: config.format === 'iife' ? 'VueAdvancedCropper' : undefined,
		globals: {
			vue: 'Vue',
		},
		sourcemap: process.env.NODE_ENV !== 'production',
	})),
	plugins: [
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
