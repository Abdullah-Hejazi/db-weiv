import { defineStore } from "pinia";
import mysql from 'mysql2'

export const useDatabaseStore = defineStore({
    id: "database",
    state: () => ({
        connection: null,
    }),

    getters: {
    },

    actions: {
        connect(host, username, password, port=3306, database=null) {
            let data = {
                host: host,
                user: username,
                port: port,
                password: password
            }

            if (database) {
                data.database = database
            }

            this.connection = mysql.createConnection(data);


            this.connection.connect((error) => {
                if (error) throw error;
            });
        },
    },
});
