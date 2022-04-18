class QueryBuilder {
    constructor(database, table) {
        this.database = database;
        this.table = table;

        this.parameters = []

        this.type = '';

        this.fields = [];

        this.additions = [];

        this.columns = [];

        this.wheres = [];

        this.indexes = [];
        this.uniques = [];

        return this;
    }

    static select(...fields) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.type= 'SELECT';
        queryBuilder.fields = fields ?? [];

        return queryBuilder;
    }

    static describe(database, table) {
        let parameters = [database, table];

        return {
            query: `DESCRIBE ??.??`,
            parameters: parameters
        }
    }

    clone() {
        let queryBuilder = new QueryBuilder();
        queryBuilder.type = this.type;
        queryBuilder.database = this.database;
        queryBuilder.table = this.table;

        queryBuilder.fields = this.#cloneArray(this.fields);
        queryBuilder.additions = this.#cloneArray(this.additions);
        queryBuilder.columns = this.#cloneArray(this.columns);
        queryBuilder.wheres = this.#cloneArray(this.wheres);
        queryBuilder.indexes = this.#cloneArray(this.indexes);
        queryBuilder.uniques = this.#cloneArray(this.uniques);
        queryBuilder.parameters = this.#cloneArray(this.parameters);

        return queryBuilder;
    }

    static createDatabase(database, charset, collation) {
        let query = `CREATE DATABASE ??`;
        let parameters = [database];

        if (charset) {
            query += ` CHARACTER SET ?`;
            parameters.push(charset);
        }

        if (collation) {
            query += ` COLLATE ?`;
            parameters.push(collation);
        }

        return {
            query: query,
            parameters: parameters
        };
    }

    static dropDatabase(database) {
        let query = `DROP DATABASE ??`;
        let parameters = [database];

        return {
            query: query,
            parameters: parameters
        };
    }

    static createTable(database, table) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.type = 'CREATE TABLE';
        queryBuilder.database = database;
        queryBuilder.table = table;

        queryBuilder.parameters.push(database, table);

        return queryBuilder;
    }

    static dropTable (database, table) {
        let query = `DROP TABLE ??.??`;
        let parameters = [database, table];

        return {
            query: query,
            parameters: parameters
        };
    }

    static show(type) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.type = type;

        return queryBuilder;
    }

    from(database, table) {
        this.database = database;
        this.table = table;

        this.parameters.push(this.database, this.table);

        return this;
    }

    where(field, operator, value) {
        this.wheres.push('?? ' + operator + ' ?');

        if (operator == 'LIKE') {
            value = `%${value}%`;
        }

        this.parameters.push(field, value);

        return this;
    }

    orderBy(field, direction) {
        this.additions.push(`ORDER BY ?? ${direction}`);
        this.parameters.push(field);

        return this;
    }

    limit(limit) {
        this.additions.push(`LIMIT ?`);
        this.parameters.push(limit);

        return this;
    }

    offset(offset) {
        this.additions.push(`OFFSET ?`);
        this.parameters.push(offset);

        return this;
    }

    /*
        addColumn(name, type, size, defaultValue, nullable, autoIncrement, primaryKey) {
            if (this.columnsCount > 0) {
                this.query += ', ';
            }

            this.query += `${name} ${type}${this.getSize(type, size)}`;

            if (defaultValue) {
                this.query += ` DEFAULT ${defaultValue}`;
            }

            if (! nullable) {
                this.query += ' NOT NULL';
            }

            if (autoIncrement) {
                this.query += ' AUTO_INCREMENT';
            }

            if (primaryKey) {
                this.query += ' PRIMARY KEY';
            }

            this.columnsCount++;
        }
    */

    addColumn(data) {
        let query = `${data.name} ${data.type.label}`;

        query += `${this.#getColumnMetaData(data)}`;

        if (data.defaultValue && data.defaultValue != 'NULL') {
            query += ` DEFAULT ${data.defaultValue}`;
        }

        if (! data.isNull) {
            query += ' NOT NULL';
        }

        if (data.autoIncrement) {
            query += ' AUTO_INCREMENT';
        }

        if (data.index === 'PRIMARY KEY') {
            query += ' PRIMARY KEY';
        }

        this.columns.push(query);

        return this;
    }

    addIndex(type, index) {
        this.indexes.push(`${type} (??)`);
        this.parameters.push(index);
    }

    addUnique(index) {
        this.indexes.push(`CONSTRAINT UNIQUE_${index} UNIQUE (??)`);
        this.parameters.push(index);
    }

    engine(engine) {
        this.additions.push(`ENGINE = ?`);
        this.parameters.push(engine);

        return this;
    }

    collation(collation) {
        this.additions.push(`CHARACTER SET = ? COLLATE = ?`);

        this.parameters.push(collation.CHARACTER_SET_NAME);
        this.parameters.push(collation.COLLATION_NAME);
    }

    build() {
        if (this.type == 'SELECT') {
            return this.#buildSelect();
        } else if (this.type == 'FULL TABLES' || this.type == 'ENGINES') {
            return this.#buildShow();
        } else if (this.type == 'CREATE TABLE') {
            return this.#buildCreateTable();
        }
    }

    // ------------------------Private Methods----------------------------- //

    #getColumnMetaData(column) {
        let result = '(';

        let defaultSizes = [
            {
                type: 'CHAR',
                size: 1
            },
            {
                type: 'VARCHAR',
                size: 255
            },
            {
                type: 'BINARY',
                size: 255
            },
            {
                type: 'VARBINARY',
                size: 255
            },
            {
                type: 'FLOAT',
                size: 24
            },
            {
                type: 'BIT',
                size: 8
            },
            {
                type: 'NUMERIC',
                size: 8
            },
            {
                type: 'DECIMAL',
                size: 8
            }
        ]

        if (column.type.values) {
            let values = column.values.split(',')
        
            // remove spaces from values
            values = values.map(value => '\'' + value.trim() + '\'');

            return `(${values.join(', ')})`;
        }

        if (column.type.size) {
            if (column.size) {
                result += `${column.size}`;
            } else {
                let size = defaultSizes.find(s => s.type === column.type.label);
    
                if (size) {
                    result += `${size.size}`;
                } else {
                    result += '16';
                }
            }
        }

        if (column.type.precision) {
            result += result.length > 1 ? ', ' : '';

            if (column.precision) {
                result += `${column.precision}`;
            } else {
                result += '4';
            }
        }

        result += ')';

        return result.length > 2 ? ' ' + result : '';
    }

    #buildSelect() {
        let query = 'SELECT ';

        query += this.fields.join(', ');

        if (this.database && this.table) {
            query += ` FROM ??.??`;
        }

        if (this.wheres.length > 0) {
            query += ' WHERE ';

            query += this.wheres.join(' AND ');
        }

        this.additions.forEach (addition => {
            query += ` ${addition}`;
        })

        return {
            query: query,
            parameters: this.parameters
        };
    }

    #buildShow() {
        let query = `SHOW ${this.type}`;


        if (this.database) {
            query += ` FROM ??`;
            this.parameters.push(this.database)
        }

        return {
            query: query,
            parameters: this.parameters
        };
    }

    #buildCreateTable() {
        let query = `CREATE TABLE ??.?? (`;

        let data = [...this.columns, ...this.indexes, ...this.uniques];

        query += data.join(', ');

        query += ')';

        this.additions.forEach (addition => {
            query += ` ${addition}`;
        })

        return {
            query: query,
            parameters: this.parameters
        };
    }

    #cloneArray(array) {
        return array.map(item => item);
    }
}

export default QueryBuilder;