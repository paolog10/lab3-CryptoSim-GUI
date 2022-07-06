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
html {
    font-size: 16px;
}

body {
    margin: 0;
    background-color: rgb(242, 242, 242);
}
</style>
