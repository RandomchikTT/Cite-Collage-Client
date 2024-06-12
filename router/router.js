import { createRouter, createWebHistory } from "vue-router";

import MainMenu from '../src/views/MainMenu/MainMenu.vue'
import CheckOut from '../src/views/CheckOut/CheckOut.vue'
import FeedBack from '../src/views/FeedBack/FeedBack.vue'

const routes = [
    {
        path: '/MainMenu',
        component: MainMenu,
    },
    {
        path: '/CheckOut',
        component: CheckOut,
    },
    {
        path: "/FeedBacks",
        component: FeedBack
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;