import Vue from 'vue'
import App from './App.vue'
import router from './router'
import cn from 'easy-bem'

const bemPlugin = {
	install () {
		Vue.mixin({
			created () {
				this['cn'] = (block, ...args) => {
					return cn(block)(...args)
				}
				const block = this.$options.block || this.$options.name
				if (typeof block === 'string') {
					const generator = cn(block)
					this['b'] = (...args) => {
						return generator(...args)
					}
				}
			}
		})
	}
}

Vue.use(bemPlugin)
Vue.config.productionTip = false
Vue.config.performance = true

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
