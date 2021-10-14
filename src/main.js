import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VCalendar from "v-calendar";
import LazyTube from "vue-lazytube";
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VCalendar);
Vue.use(LazyTube);
Vue.use(VueAnalytics, {
  id: 'UA-210251103-1',
})

new Vue({
  render: (h) => h(App),
}).$mount("#app");
