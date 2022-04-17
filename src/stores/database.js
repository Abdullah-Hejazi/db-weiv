// import mysql from 'mysql2/promise'
import dbservice from '@/services/dbservice'

const database = {
    namespaced: true,

    state() {
        return {
            connected: false,
            data: null,
            databases: [],
            collations: []
        }
    },

    mutations: {
        setConnected(state, connected) {
            state.connected = connected
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
        async connect(context, form) {
            await context.dispatch('clearConnection')

            let data = {
                host: form.host,
                user: form.username,
                port: form.port,
                password: form.password,
                multipleStatements: true
            }

            let error = null

            try {
                await dbservice.createConnection(data)

                let connection = await dbservice.getConnection();
                await connection.query('SELECT 1;')

                context.commit('setData', data)
                context.commit('setConnected', true)

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message
            }
        },

        async refreshDatabases(context, form) {
            let error = null

            try {
                let connection = await dbservice.getConnection();

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

        async createDatabase(context, form) {
            let error = null

            try {
                let connection = await dbservice.getConnection();

                await connection.query(
                    'CREATE DATABASE ?? CHARACTER SET ? COLLATE ?;',
                    [form.name, form.collation.CHARACTER_SET_NAME, form.collation.COLLATION_NAME]
                )

                let result = await context.dispatch('refreshDatabases')

                if (!result.success) {
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

        async dropDatabase(context, schema) {
            let error = null

            try {
                let connection = await dbservice.getConnection();

                await connection.query(
                    'DROP DATABASE ??;',
                    [schema]
                )

                let result = await context.dispatch('refreshDatabases')

                if (!result.success) {
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

        async getDatabase(context, schema) {
            let error = null
            let result = []
            let name = ''
            let engines = []

            try {
                let connection = await dbservice.getConnection();

                result = await connection.query(
                    'USE ??; SHOW FULL TABLES; SHOW ENGINES;',
                    [schema]
                )

                name = result[1][1][0].name
                engines = result[0][2]
                result = result[0][1]

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message,
                data: result,
                name: name,
                engines: engines
            }
        },

        // this thing needs refactoring lol
        async createTable(context, form) {
            let result = []
            let error = null
            let unique = []
            let indexes = []
            let fulltexts = []

            let data = []

            function getDefaultSize(type) {
                if (type == 'VARCHAR') {
                    return 255
                } else if (type == 'CHAR') {
                    return 1
                } else if (type == 'BINARY') {
                    return 255
                } else if (type == 'VARBINARY') {
                    return 255
                } else if (type == 'FLOAT') {
                    return 24
                } else if (type == 'BIT') {
                    return 8
                } else if (type == 'NUMERIC' || type == 'DECIMAL') {
                    return 8
                }

                return 16
            }

            try {
                let query = 'USE ??; CREATE TABLE ?? (';
                data.push(form.databaseName)
                data.push(form.tableName)

                for (let i = 0; i < form.columns.length; i++) {
                    if (form.columns[i].index == 'UNIQUE') {
                        unique.push(form.columns[i])
                    }

                    if (form.columns[i].index == 'INDEX') {
                        indexes.push(form.columns[i].name)
                    }

                    if (form.columns[i].index == 'FULLTEXT') {
                        fulltexts.push(form.columns[i].name)
                    }

                    query += '?? ' + form.columns[i].type.label + ' ';

                    if (form.columns[i].type.values) {
                        let values = form.columns[i].values.split(',')
                        // remove starting space and ending space in values
                        for (let j = 0; j < values.length; j++) {
                            values[j] = '\'' + values[j].trim() + '\''
                        }
                        
                        // add values to query between single qoutation mark
                        query += '(' + values.join(',') + ') ';

                        // query += '(' + form.columns[i].values + ') ';
                    }

                    data.push(form.columns[i].name)

                    if (form.columns[i].type.size) {
                        if (form.columns[i].size) {
                            query += '(' + form.columns[i].size;
                        } else {
                            query += '(' + getDefaultSize(form.columns[i].type.label);
                        }

                        if (form.columns[i].type.precision) {
                            if (form.columns[i].precision) {
                                query += ',' + (form.columns[i].precision) + ') ';
                            } else {
                                query += ',' + 4 + ') ';
                            }
                        } else {
                            query += ') ';
                        }
                    }

                    query += (form.columns[i].isNull ? '' : 'NOT NULL') + ' ' + (form.columns[i].autoIncrement ? 'AUTO_INCREMENT' : '') + ' ';

                    // query += ((form.columns[i].defaultValue && form.columns[i].defaultValue != 'None' && form.columns[i].defaultValue != 'NULL') ? 'DEFAULT \'' + form.columns[i].defaultValue + '\'' : '') + ' ';
                    
                    if (form.columns[i].defaultValue == 'CURRENT_TIMESTAMP') {
                        query += 'DEFAULT ' + form.columns[i].defaultValue + ' ';
                    } else if (form.columns[i].defaultValue != 'None' && form.columns[i].defaultValue != 'NULL') {
                        query += 'DEFAULT \'' + form.columns[i].defaultValue + '\'' + ' ';
                    }

                    query +=  (form.columns[i].index == 'PRIMARY KEY' ? 'PRIMARY KEY' : '') + ' ' + (i < form.columns.length - 1 ? ', ' : '');
                }

                for (let i = 0; i < unique.length; i++) {
                    query += ', CONSTRAINT ';

                    query += 'UNIQUE_' + unique[i].name + ' ';

                    query += 'UNIQUE (??) ';
                    data.push(unique[i].name)
                }

                if (indexes.length > 0 ) {
                    query += ', INDEX (';
                }

                for (let i = 0; i < indexes.length; i++) {
                    query += '?? ' + (i < indexes.length - 1 ? ', ' : ')');
                    data.push(indexes[i])
                }
                
                if (fulltexts.length > 0 ) {
                    query += ', FULLTEXT (';
                }

                for (let i = 0; i < fulltexts.length; i++) {
                    query += '?? ' + (i < fulltexts.length - 1 ? ', ' : ')');
                    data.push(fulltexts[i])
                }

                query += ') ';

                if (form.engine) {
                    query += 'ENGINE = ' + form.engine.Engine + ' ';
                }

                if (form.collation) {
                    query += 'CHARACTER SET ' + form.collation.CHARACTER_SET_NAME + ' COLLATE ' + form.collation.COLLATION_NAME + ' ';
                }

                let connection = await dbservice.getConnection();

                result = await connection.query(
                    query,
                    data
                )

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message
            }
        },

        async loadTable(context, form) {
            let error = null
            let result = []

            try {
                let connection = await dbservice.getConnection();

                let baseQuery = 'FROM ??.?? ';
                let data = [form.database, form.table];

                if (form.sort) {
                    baseQuery += 'ORDER BY ?? ' + form.sort.order + ' ';
                    data.push(form.sort.field)
                }

                let finalQuery = 'SELECT * ' + baseQuery + 'LIMIT ? OFFSET ?;';
                finalQuery += 'SELECT COUNT(*) as count ' + baseQuery;

                result = await connection.query(
                    finalQuery,
                    [...data, form.perPage, form.page, ...data]
                )

            } catch (e) {
                error = e
            }

            return {
                success: !error,
                error: error?.message,
                data: result
            }
        },

        async clearConnection(context) {
            context.commit('setData', null)
            context.commit('setConnected', false)
            await dbservice.endConnection();
        }
    },
}

export default database;