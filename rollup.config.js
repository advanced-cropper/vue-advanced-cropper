import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import sass from 'rollup-plugin-sass';
import Vue from 'rollup-plugin-vue';
import pkg from './package.json';
import includePaths from 'rollup-plugin-includepaths';
import collectSass from 'rollup-plugin-collect-sass'


import { createFilter } from 'rollup-pluginutils'
import { EOL } from 'os'
import path from 'path'
import fse from 'fs-extra'
import CleanCSS from 'clean-css'

const ext = /\.css$/;

function plugin (options = {}) {
	if (!options.include) options.include = '**/*.css'

	console.log('плагин запустился')
	const filter = createFilter(options.include, options.exclude);
	const cached = {
		ids: {},
		style: '',
		count: 0
	}
	console.log('плагин запустился')

	return {
		name: 'rollup-plugin-css-porter',
		/** See https://rollupjs.org/guide/en#transformers */
		transform(code, id) {
			if (!ext.test(id)) return
			if (!filter(id)) return
			//	console.log(cached)

			cached.count -= 1

			// cache all css code
			if (!cached.ids.hasOwnProperty(id) || cached.ids[id] != code) cached.style += code
			cached.ids[id] = id

			//console.log('трансформ', cached.count)



			if (cached.count === 0) {
				return cached.style
			} else {
				return ''
			}
		},

		renderChunk(...args) {
			console.log('>>>', args)
		},
		load(id) {
			if (!ext.test(id)) return
			if (!filter(id)) return
			cached.count += 1

			//	console.log(id)

		}

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
		plugin(),
		external(),
		Vue({
			css: false,
		}),
		postcss({
			inject: {
				insertAt: 'top'
			}
		}),
		url(),
		babel({
			exclude: 'node_modules/**',
		}),
		resolve(),
		commonjs(),
	]
}
