import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home/Main.vue";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			alias: "*",
			name: "home",
			component: Home
		},
		{
			path: "/docs",
			name: "docs",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
				import(/* webpackChunkName: "about" */ "./views/Docs/Main.vue")
		}
	]
});
