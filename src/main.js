import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router';
import axios from 'axios';
import msg from './msghash'

import 'element-ui/lib/theme-chalk/index.css'
import elementUI from 'element-ui'

//Font-Awesome
import '../assets/lib/fontawesome/less/fontawesome.less'
import '../assets/lib/fontawesome/less/light.less'
import '../assets/lib/fontawesome/less/regular.less'
import '../assets/lib/fontawesome/less/solid.less'

import 'gui2018/src/less/main.less'
import './static/main.less'

Vue.use(VueRouter);
Vue.use(elementUI);

Vue.prototype.$axios = axios;

//axios拦截器
axios.interceptors.request.use(config => {
    const _token = localStorage.getItem("token"),
          _uid = localStorage.getItem("uid");
    if (_token) { config.headers["X-Authorization"] = "Bearer " + _token; }
    if (_uid) { config.headers["X-AUTH-ID"] = _uid; }
    return config;
})

axios.interceptors.response.use(res => {
    return res.data;
}, error => {
    if (error.response) {
        //是否需要判断配置环境？
        if([401,403].includes(parseInt(error.response.status))) {
            router.push('/login');
        } else {
            let msgContent = error.error || error.message || error.response.data.error;
            msgContent && vue.$confirm(msg.getMsg(msgContent), '错误', { type: 'warning' });
        }
    } else {
        let msgContent = error.error || error.message || error.response.data.error;
        msgContent && vue.$confirm(msg.getMsg(msgContent), '错误', { type: 'warning' });
    }
    return Promise.reject(error);
});


const vue = new Vue({
    el: '#app',
    router,
    methods: {
        saveToken(data) {
            localStorage.setItem('uid', data.id);
            localStorage.setItem('token', data.token);
        }
    },
    render: h => h(App)
})
