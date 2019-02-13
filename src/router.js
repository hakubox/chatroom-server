import VueRouter from 'vue-router';

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            componect: import('./views/example.vue')
        },
        {
            path: '/example1',
            component: import('./views/example1.vue')
        },
        {
            path: '/example2',
            component: import('./views/example2.vue')
        }
    ]
});