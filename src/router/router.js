import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Tradear from '../views/Tradear.vue'
import Movimientos from '../views/Movimientos.vue'
import Cartera from '../views/Cartera.vue'
import Resultados from '../views/Resultados.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/tradear",
        name: "Tradear",
        component: Tradear,
    },
    {
        path: "/movimientos",
        name: "Movimientos",
        component: Movimientos,
    },
    {
        path: "/cartera",
        name: "Cartera",
        component: Cartera,
    },
    {
        path: "/resultados",
        name: "Resultados",
        component: Resultados,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
