<script>
import { mapState } from "pinia"
import { useUserStore } from "../stores/userStore"
import IconMenu from "../components/icons/IconMenu.vue"

export default {
    computed: {
        ...mapState(useUserStore, ["username"]),
    },

    components: {
        IconMenu,
    }
}
</script>

<template>
<header>
    <nav>
        <router-link class="navlink logo" :to="{name: 'Home'}">CryptoSim</router-link>

        <template v-if="username">
            <div class="app-tools regular-menu-item">
                <router-link class="navlink toollink" :to="{name: 'Tradear'}" active-class="tool-active">Tradear</router-link>
                <router-link class="navlink toollink" :to="{name: 'Movimientos'}" active-class="tool-active">Movimientos</router-link>
                <router-link class="navlink toollink" :to="{name: 'Cartera'}" active-class="tool-active">Cartera</router-link>
                <router-link class="navlink toollink" :to="{name: 'Resultados'}" active-class="tool-active">Resultados</router-link>
            </div>

            <router-link class="navlink regular-menu-item" :to="{name: 'Logout'}">Cerrar sesión</router-link>
        </template>

        <template v-if="username">
            <button
                class="burger-button"
                @click="this.$refs.burgerContainer.style.display = 'block'"
            >
                <IconMenu />
            </button>
            <div
                class="burger-container"
                ref="burgerContainer"
                @click="this.$refs.burgerContainer.style.display = 'none'"
            >
                <div class="burger-menu">
                    <router-link class="navlink toollink" :to="{name: 'Tradear'}" active-class="tool-active">Tradear</router-link>
                    <router-link class="navlink toollink" :to="{name: 'Movimientos'}" active-class="tool-active">Movimientos</router-link>
                    <router-link class="navlink toollink" :to="{name: 'Cartera'}" active-class="tool-active">Cartera</router-link>
                    <router-link class="navlink toollink" :to="{name: 'Resultados'}" active-class="tool-active">Resultados</router-link>
                    <router-link class="navlink logout" :to="{name: 'Logout'}">Cerrar sesión</router-link>
                </div>
            </div>
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
    margin: 0 1rem;
    border-bottom: solid 0.2rem transparent;
}

.tool-active {
    color: #FF9C33;
    border-bottom-color: #FF9C33
}

.logout {
    margin-top: 0.1rem;
    margin-left: auto;
    margin-right: auto;
}

.burger-button {
    display: none;
    border: unset;
    padding: unset;
    cursor: pointer;
    background-color: transparent;
    fill: white;
}

.burger-button:hover {
    fill: #f8b46b;
}

.burger-container {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
}

.burger-menu {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 20px;
    right: 0;
    background-color: #181818;
    padding: 12px;
    border-radius: 5px;
}

.burger-menu a {
    margin: 0.3rem 0;
}

@media (max-width: 415px) {
    header {
        padding-left: 17px;
        padding-right: 17px;
    }
}

@media (max-width: 900px) {
    .burger-button {
        display: block;
    }

    .burger-menu {
        display: flex;
    }

    .regular-menu-item {
        display: none;
    }
}
</style>
