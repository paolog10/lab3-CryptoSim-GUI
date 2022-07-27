<script>
import { mapState } from "pinia"
import { useUserStore } from "../stores/userStore"

export default {
    computed: {
        ...mapState(useUserStore, ["username"]),
    },
}
</script>

<template>
<header>
    <nav>
        <router-link class="navlink logo" :to="{name: 'Home'}">CryptoSim</router-link>

        <template v-if="username">
            <div class="app-tools">
                <router-link class="navlink toollink" :to="{name: 'Tradear'}" active-class="tool-active">Tradear</router-link>
                <router-link class="navlink toollink" :to="{name: 'Movimientos'}" active-class="tool-active">Movimientos</router-link>
                <router-link class="navlink toollink" :to="{name: 'Cartera'}" active-class="tool-active">Cartera</router-link>
                <router-link class="navlink toollink" :to="{name: 'Resultados'}" active-class="tool-active">Resultados</router-link>
            </div>

            <router-link class="navlink" :to="{name: 'Logout'}">Cerrar sesión</router-link>
        </template>

        <router-link v-else class="navlink" :to="{name: 'Login'}">Iniciar sesión</router-link>
    </nav>
</header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Vollkorn+SC:wght@700&display=swap');

header {
    background-color: #181818;
    padding: 0.8rem 3rem;
    border-bottom: solid 3px #FF9C33;
    box-shadow: 0px 0px 7px #333;
}

nav {
    width: 100%;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
}

.navlink {
    color: white;
    text-decoration: none;
    user-select: none;
}

.navlink:hover {
    color: #ffb667;
}

.logo {
    font-size: 1.8rem;
    font-family: 'Vollkorn SC'
}

.logo:hover {
    color: white;
}

.app-tools {
    display: flex;
    justify-content: space-between;
    
}

.toollink {
    padding: 0.2rem 0;
    margin: 0 1rem;
    border-bottom: solid 0.3rem transparent;
}

.tool-active {
    color: #FF9C33;
    border-bottom-color: #FF9C33
}
</style>
