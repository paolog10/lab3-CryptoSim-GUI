import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null,
    }),
    actions: {
        login(inputUsername) {
            this.username = inputUsername
        },

        logout() {
            this.username = null;
        }
    }
})