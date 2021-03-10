"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolInteraction = void 0;
const Connection_1 = require("./Connection");
class PoolInteraction extends Connection_1.Connection {
    async query(sql) {
        return await this.pool.query(sql);
    }
    async transaction(cb) {
        const client = await this.pool.connect();
        client.query('BEGIN');
        try {
            await cb(client);
            client.query('COMMIT');
        }
        catch (err) {
            console.log(err.message);
            client.query('ROLLBACK');
        }
        client.release();
    }
    async findBy(Model, params, options = {}) {
        let query = `SELECT * FROM ${Model.getTableName()}\n`;
        let first = false;
        for (const key in params) {
            if (!first) {
                query += `WHERE `;
                first = true;
            }
            else {
                query += `AND `;
            }
            if (Array.isArray(params[key])) {
                query += `(`;
                for (const value of params[key]) {
                    query += `${key} = '${value}' OR `;
                }
                query = query.slice(0, -3) + ')\n';
            }
            else {
                query += `${key} = '${params[key]}'\n`;
            }
        }
        if (options['order']) {
            const key = Object.keys(options['order'])[0];
            query += `ORDER BY ${key} ${options['order'][key]}\n`;
        }
        if (options['limit']) {
            query += `LIMIT ${options['limit']}`;
        }
        const result = await this.pool.query(query);
        const instances = [];
        if (result.rows[0]) {
            for (const row of result.rows) {
                instances.push(Model.instanceModelWithProperties(row));
            }
            return instances;
        }
        return null;
    }
    rollbackTesting(beforeCb = null, afterCb = null) {
        if (!beforeCb) {
            beforeCb = async () => await this.pool.query("BEGIN");
        }
        if (!afterCb) {
            afterCb = async () => {
                await this.pool.query("ROLLBACK");
            };
        }
        before(beforeCb);
        after(afterCb);
    }
}
exports.PoolInteraction = PoolInteraction;
PoolInteraction.instance = undefined;
//# sourceMappingURL=PoolInteraction.js.map