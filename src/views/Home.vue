<script>
import CoinInfoCard from '../components/CoinInfoCard.vue'

export default {
    components: {
        CoinInfoCard,
    }
}
</script>

<template>
<div class="home-view">
    <div class="home-intro">
        <h1>Simula el intercambio de criptomonedas</h1>
        <div class="home-intro-descripcion">
            <p>
                CryptoSim te permite comprar y vender criptodivisas de manera ficticia
            </p>
            <p>
                En base a las transacciones realizadas se calcula un balance que muestra
                lo que hubieses ganado o perdido realmente, teniendo en cuenta el precio actualizado de las
                monedas intercambiadas según varios exchanges
            </p>
        </div>
    </div>

    <div class="cotizaciones">
        <h2>Cotizaciones actuales</h2>
        <CoinInfoCard />
    </div>
</div>

</template>

<style scoped>
.home-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    font-family: 'Montserrat', sans-serif;
    padding: 0 2%;
}

.home-intro {
    margin: 5rem 0;
}

.home-intro-descripcion {
    margin: 0.5rem;
}

h1, h2 {
    text-align: center;
    margin: 0;
    color: #282828;
}

p {
    width: 48%;
    text-align: center;
    line-height: 1.3rem;
    margin: 1rem auto;
}

.cotizaciones {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
}

.cotizaciones h2 {
    margin-bottom: 0.4rem;
}

.link-fuente {
    align-self: flex-end;
    margin-top: 0.2rem;
    color: #222;
    text-decoration: none;
    user-select: none;
}

.link-fuente:hover {
    text-decoration: underline;
    text-decoration-color: #ffa94e;
    text-decoration-thickness: 0.2rem;
    color: black;
}

@media (max-width: 415px) {
    h1 {
        font-size: 1.8rem;
    }

    .home-intro {
        margin: 2rem 0;
    }

    p {
        width: 100%;
        line-height: 1.3rem;
    }
}
</style>
