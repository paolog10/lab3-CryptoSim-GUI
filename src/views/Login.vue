<script>
import { mapActions } from "pinia"
import { useUserStore } from "../stores/userStore"

export default {
    data() {
        return {
            usernameIngresado: null,
            mantenerSesionAbierta: false,
            loginFallido: false,
        }
    },

    computed: {
        esUsernameValido() {
            // La expresión regular solo acepta strings alfanuméricas de 4 a 20 caracteres
            // No acepta 'ñ' ni letras con tilde.
            return this.usernameIngresado !== null
                && /^[a-zA-Z0-9]{4,20}$/.test(this.usernameIngresado)
        },
    },

    methods: {
        ...mapActions(useUserStore, ["login"]),

        intentarLogin() {
            if (!this.esUsernameValido) {
                return this.loginFallido = true;
            }

            this.login(this.usernameIngresado, this.mantenerSesionAbierta)

            // Ruta Login no debe ser accedida si ya hay una sesión iniciada
            this.$router.push({name: "Home"})
        },
    }
}
</script>

<template>
<div class="login-view">
    <h1>Iniciar sesión en CryptoSim</h1>

    <form @submit.prevent="intentarLogin">
        <label class="text-form-control">
            Nombre de usuario
            <small>Alfanumérico de 4 a 20 caracteres</small>
            <input
                type="text"
                v-model="usernameIngresado"
            >
            <div class="username-feedback">
                <!--
                    No se muestra ningún mensaje de error inicialmente porque por defecto
                    usernameIngresado === null
                -->
                <small
                    v-if="usernameIngresado !== null || loginFallido"
                    :class="{'valid-username': esUsernameValido, 'invalid-username': !esUsernameValido}"
                >
                    {{ esUsernameValido ? "Nombre de usuario válido" : "Nombre de usuario inválido" }}
                </small>
            </div>
        </label>

        <label class="checkbox-form-control">
            Mantener sesión abierta
            <input
                type="checkbox"
                v-model="mantenerSesionAbierta"
            >
        </label>

        <button
            class="login-button"
            type="submit"
        >
            Iniciar sesión
        </button>
    </form>
</div>
</template>

<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
}

.login-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    flex-grow: 0.4;
    margin-bottom: auto;
    margin-top: 3%;
}

h1 {
    margin: 0;
    color: #222;
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0.75rem 1.6rem;
    flex: 0.3;
    width: 58%;
    border: solid 1px #333;
    background-color: rgb(235, 235, 235);
    font-size: 0.9rem;
    font-weight: 400;
}

.text-form-control {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    margin-top: 0.25rem;
    padding: 0.25rem 0.45rem;
}

.checkbox-form-control {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.checkbox-form-control input {
    margin-left: 0.4rem;
}

.login-button {
    background-color: #FF9C33;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.login-button:hover {
    background-color: #ffa647;
}

.login-button:active {
    background-color: #ff9320;
}

form, input, .login-button {
    border: solid 1px #333;
    border-radius: 0.3rem;
}

.username-feedback {
    display: flex;
    align-items: center;
    height: 1rem;
    padding-top: 0.2rem;
}

.invalid-username {
    color: rgb(155, 0, 0);
}

.valid-username {
    color: rgb(0, 155, 0);
}
</style>
