let mysql = require('mysql2/promise');
let pool = null

export default {
    createConnection: async (data) => {
        pool = await mysql.createPool(data)
    },

    getConnection: () => {
        return pool
    },

    endConnection: () => {
        pool?.end();
        pool = null;
    }
};