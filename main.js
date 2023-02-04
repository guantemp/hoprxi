import App from './App'
import {
	toast,
	navTo,
	throttle,
	debounce
} from '@/js_sdk/util.js';
import Request from '@/js_sdk/luch-request/luch-request/index.js'
import store from "./store";
import pinia from "./pinia";
// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App);
	app.use(store);
	app.use(pinia);
	app.config.globalProperties.$util = {
		toast,
		navTo,
		throttle,
		debounce
	};
	app.config.globalProperties.$http = new Request();
	return {
		app
	}
}
// #endif
// #ifndef VUE3
import Vue from 'vue'
//挂载全局方法
Vue.prototype.$store = store;
Vue.prototype.$util = {
	toast,
	navTo,
	throttle,
	debounce
};
Vue.prototype.$http = new Request();
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store: store,
})
app.$mount()
// #endif
