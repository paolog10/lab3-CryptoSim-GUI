<script>
import TheHeader from "./components/TheHeader.vue"
import TheFooter from "./components/TheFooter.vue"

export default {
    components: {
        TheHeader,
        TheFooter,
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
