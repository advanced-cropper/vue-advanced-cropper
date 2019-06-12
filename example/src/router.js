import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home/Main.vue';
import * as Docs from './views/Docs/';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			alias: '*',
			name: 'home',
			component: Home
		},
		{
			path: '/docs',
			name: 'docs',
			children: [
				{
					path: 'intro',
					component: Docs.Intro
				},
			],
			component: Docs.Main
		}
	]
});
