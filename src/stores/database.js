import mysql from 'mysql2/promise'

const database = {
    state() {
        return {
            connection: null,
            data: {},
            databases: [],
            collations: []
        }
    },

    mutations: {
        setConnection(state, connection) {
            state.connection = connection
        },

        setData(state, data) {
            state.data = data
        },

        setDatabases(state, databases) {
            state.databases = databases
        },

        setCollations(state, collations) {
            state.collations = collations
        }
    },

    actions: {
        async connect (context, form) {
            context.dispatch('clearConnection')

            let data = {
                host: form.host,
                user: form.username,
                port: form.port,
                password: form.password,
                multipleStatements: true
            }

            let error = null

            try {
                context.commit('setConnection', await mysql.createPool(data))

                let result = await context.dispatch('refreshDatabases')

                if (! result.success) {
                    return {
                        success: false,
                        error: result.error
                    }
                }
                
            } catch (e) {
                error = e
            }

            context.commit('setData', data)

            return {
                success: !error,
                error: error?.message
            }
        },

        async refreshDatabases (context, form) {
            let error = null

            try {
                let connection = await context.state.connection.getConnection()

                let [result] = await connection.query('SELECT * FROM information_schema.SCHEMATA; SELECT * FROM information_schema.COLLATIONS;')

                context.commit('setDatabases', result[0])
                context.commit('setCollations', result[1])

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message
            }
        },

        async createDatabase (context, form) {
            let error = null

            try {
                let connection = await context.state.connection.getConnection()

                await connection.query(
                    'CREATE DATABASE ?? CHARACTER SET ? COLLATE ?;',
                    [form.name, form.collation.CHARACTER_SET_NAME, form.collation.COLLATION_NAME]
                )

                let result = await context.dispatch('refreshDatabases')

                if (! result.success) {
                    return {
                        success: false,
                        error: result.error
                    }
                }

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message
            }
        },

        async dropDatabase (context, schema) {
            let error = null

            try {
                let connection = await context.state.connection.getConnection()

                await connection.query(
                    'DROP DATABASE ??;',
                    [schema]
                )

                let result = await context.dispatch('refreshDatabases')

                if (! result.success) {
                    return {
                        success: false,
                        error: result.error
                    }
                }

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message
            }
        },

        async getDatabase (context, schema) {
            let error = null
            let result = []
            let name = ''

            try {
                let connection = await context.state.connection.getConnection()

                result = await connection.query(
                    'USE ??; SHOW FULL TABLES;',
                    [schema]
                )

                name = result[1][1][0].name

                result = result[0][1]

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message,
                data: result,
                name: name
            }
        },

        clearConnection(context) {
            context.commit('setData', {})
            context.commit('setConnection', null)
        }
    },
}

export default database;