import { createRouter, createWebHashHistory } from "vue-router";
import DatabasesView from "../views/DatabasesView.vue";
import LoginView from "../views/LoginView.vue";
import TablesView from "../views/TablesView.vue";
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
            component: DatabasesView,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/databases/:database",
            name: "tables",
            component: TablesView,
            meta: {
                requiresAuth: true
            }
        },
    ],
});


router.beforeEach((to, from) => {
    if (to.meta.requiresAuth) {
        if (!store.state.database.connection) {
            return '/'
        }
    }

    if (! to.meta.requiresAuth) {
        if (store.state.database.connection) {
            return '/databases'
        }
    }

    return true
})

export default router;
