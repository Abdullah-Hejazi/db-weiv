import { defineStore } from "pinia";
import mysql from 'mysql2/promise'

export const useDatabaseStore = defineStore({
    id: "database",
    state: () => ({
        connection: null,
        data: {},
        databases: []
    }),

    getters: {
    },

    actions: {
        async Connect(host, username, password, port) {
            this.ClearConnection();

            let data = {
                host: host,
                user: username,
                port: port,
                password: password
            }

            let error = null

            try {
                this.connection = await mysql.createPool(data)

                let [databases] = await this.connection.query('SHOW DATABASES')
                this.databases = databases
            } catch (e) {
                error = e
            }

            this.data = data

            return {
                success: !error,
                error: error?.message
            }
        },

        ClearConnection() {
            this.data = {}
            this.connection = null
        }
    },
});
