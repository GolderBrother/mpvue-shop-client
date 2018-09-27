import Vue from 'vue';
import App from './index.vue';
const app = new Vue(App);
app.$mount();

export default {
  config: {
    enablePullDownRefresh: true
  },
  usingComponents: {
    "i-page": "../../../static/iview-weapp/page/index"
  }
}
