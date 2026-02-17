import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import routes from './router';
import VueMoment from 'vue-moment';
import VueSweetalert2 from 'vue-sweetalert2';
import VueTheMask from 'vue-the-mask';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);
Vue.use(VueRouter);
Vue.use(VueMoment);
Vue.use(VueTheMask);


Vue.config.productionTip = false;
const router = new VueRouter({routes});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
