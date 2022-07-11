import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        // Defaultea a 'null' si no hay sesión abierta
        username: localStorage.getItem('username')
    }),

    actions: {
        login(username, mantenerSesionAbierta) {
            this.username = username

            if (mantenerSesionAbierta) {
                localStorage.setItem('username', username)
            }
        },

        logout() {
            this.username = null;
            localStorage.removeItem('username');
        }
    }
})
