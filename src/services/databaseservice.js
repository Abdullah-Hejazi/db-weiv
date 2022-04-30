import dbservice from '@/services/dbservice'
import QueryBuilder from '@/services/querybuilder'
import SqlFile from '@/services/sqlfile'

class DatabaseService {
    constructor(database) {
        this.database = database;
    }

    async exportTable(options) {
        let count = await this.getTableCount(options.table);
        let structure = await this.getTableStructure(options.table);

        const linesPerPatch = options.linesPerPatch || 1000;

        const sqlFile = new SqlFile(options.file, options.clear);
        sqlFile.writeCreateTable(options.table, structure);

        let query = QueryBuilder.select('*');
        query.from(this.database, options.table);

        let iterations = Math.ceil(count / linesPerPatch);

        for (let i = 0; i < iterations; i++) {
            let query = QueryBuilder.select('*');
            query.from(this.database, options.table);
            query.limit(linesPerPatch).offset(i * linesPerPatch);

            let [rows] = await dbservice.query(query.build());
            // result = result.concat(rows);

            sqlFile.writeInsert(rows);
            sqlFile.close();
        }
    }

    async getTableStructure(table) {
        let describeQuery = QueryBuilder.describe(this.database, table);
        let describe = await dbservice.query(describeQuery);
        console.log(describe)

        return describe[0]
    }

    async getTableCount(table) {
        let countQuery = QueryBuilder.select('COUNT(*) as count');
        countQuery.from(this.database, table);

        let [count] = await dbservice.query(countQuery.build());

        return count[0].count;
    }
}

export default DatabaseService