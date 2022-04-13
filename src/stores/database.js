import { defineStore } from "pinia";
import mysql from 'mysql2/promise'

export const useDatabaseStore = defineStore({
    id: "database",
    state: () => ({
        connection: null,
    }),

    getters: {
    },

    actions: {
        async connect(host, username, password, port) {
            let data = {
                host: host,
                user: username,
                port: port,
                password: password
            }

            let error = null

            this.connection = await mysql.createConnection(data).catch(err => {
                error = err
            })

            return {
                error: error?.message,
                success: !error
            }
        },
    },
});
