<script>
import TheHeader from "./components/TheHeader.vue"

export default {
    components: {
        TheHeader,
    }
}
</script>

<template>
<TheHeader />
<router-view></router-view>
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
