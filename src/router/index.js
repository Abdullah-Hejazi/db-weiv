import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import DatabaseView from "../views/DatabaseView.vue";
import store from '@/stores/store'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "login",
            component: LoginView,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/databases",
            name: "databases",
            component: HomeView,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/databases/:database",
            name: "tables",
            component: DatabaseView,
            meta: {
                requiresAuth: true
            }
        },
    ],
});


router.beforeEach((to, from) => {
    if (to.meta.requiresAuth) {
        if (!store.state.database.connected) {
            return '/'
        }
    }

    if (! to.meta.requiresAuth) {
        if (store.state.database.connected) {
            return '/databases'
        }
    }

    return true
})

export default router;
