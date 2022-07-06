<template>
<footer>
    <small>© 2022 TimbaSim</small>
    <p><a href="https://github.com/LBonino/lab3-crypto-exchange-gui" class="link" target="_blank">GitHub repo</a></p>
</footer>
</template>

<style scoped>
footer {
    position:static;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: rgb(224, 224, 224);
    border-top: solid 1px #bbb;
}

.link {
    color: #222;
    text-decoration: none;
    user-select: none;
}

.link:hover {
    text-decoration: underline;
    text-decoration-color: #ffa94e;
    text-decoration-thickness: 0.2rem;
    color: black;
}
</style>