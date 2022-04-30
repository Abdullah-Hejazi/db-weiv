
const fs = require('fs');

class SqlFile {
    constructor(file, clear=false) {
        this.file = fs.createWriteStream(file, {flags: clear ? 'w' : 'a'});
    }
    
    writeCreateTable(table, structure) {
        let insert = `CREATE TABLE ${table} (\n`;
        structure.forEach(column => {
            let defaultVal = column.Default ? `DEFAULT '${column.Default}'` : '';

            insert += `\t\`${column.Field}\` ${column.Type} ${column.Null == "YES" ? 'NULL' : 'NOT NULL'} ${defaultVal} ${column.Key ? 'PRIMARY KEY' : ''},\n`;
        });
        insert = insert.slice(0, -2);
        insert += '\n);\n\n';

        // write unique and index
        structure.forEach(column => {
            if (column.Key == 'UNI') {
                insert += `ALTER TABLE ${table} ADD UNIQUE (${column.Field});\n`;
            }
            if (column.Key == 'MUL') {
                insert += `ALTER TABLE ${table} ADD INDEX (${column.Field});\n`;
            }
        });

        insert += '\n';

        this.file.write(insert);
    }
        // console.log(structure)
        // let columns = Object.keys(structure).map(column => `${column} ${structure['Type']}`).join(', ');
        // this.file.write(`CREATE TABLE ${table} (${columns});\n`);

    writeInsert(data) {
        data.forEach(line => {
            this.file.write(this.getInsertStatement('users', line));
        })
    }

    getInsertStatement(table, data) {
        let columns = Object.keys(data).join(', ');
        let values = Object.values(data).map(value => `'${value}'`).join(', ');
        return `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
    }

    close() {
        this.file.end();
    }
}

export default SqlFile;