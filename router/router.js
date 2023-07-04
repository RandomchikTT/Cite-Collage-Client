import { createRouter, createWebHistory } from "vue-router";

import MainMenu from '../src/views/MainMenu/MainMenu.vue'

const routes = [
    {
        path: '/MainMenu',
        component: MainMenu,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;