import { createRouter, createWebHistory } from "vue-router";

import MainMenu from '../src/views/MainMenu/MainMenu.vue'
import CheckOut from '../src/views/CheckOut/CheckOut.vue'

const routes = [
    {
        path: '/MainMenu',
        component: MainMenu,
    },
    {
        path: '/CheckOut',
        component: CheckOut,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;