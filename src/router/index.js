import { createRouter, createWebHashHistory } from "vue-router";
import DatabasesView from "../views/DatabasesView.vue";
import LoginView from "../views/LoginView.vue";
import store from '@/stores/store'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "login",
            component: LoginView
        },
        {
            path: "/databases",
            name: "databases",
            component: DatabasesView
        },
    ],
});

const authRoutes = [
    '/databases'
];

const nonAuthRoutes = [
    '/'
];


router.beforeEach((to, from) => {
    if (authRoutes.includes(to.path)) {
        if (!store.state.database.connection) {
            return '/'
        }
    }

    if (nonAuthRoutes.includes(to.path)) {
        if (store.state.database.connection) {
            return '/databases'
        }
    }

    return true
})

export default router;
