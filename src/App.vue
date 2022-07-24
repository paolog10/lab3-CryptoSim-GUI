<script>
import TheHeader from "./components/TheHeader.vue"
import TheFooter from "./components/TheFooter.vue"
import { useUserStore } from "./stores/userStore"
import { mapActions, mapState } from "pinia"

export default {
    components: {
        TheHeader,
        TheFooter,
    },

    computed: {
        ...mapState(useUserStore, ["historialTransacciones", "username"])
    },

    methods: {
        ...mapActions(useUserStore, ["cargarCartera", "cargarHistorialTransacciones"])
    },

    mounted() {
        if (this.username) {
            this.cargarHistorialTransacciones()
                .then(() => this.cargarCartera())
        }
    }
}
</script>

<template>
<TheHeader />
<main>
    <router-view></router-view>
</main>
<TheFooter />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

html {
    font-size: 16px;
}

body {
    margin: 0;
}

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    flex: 1;
}

</style>
