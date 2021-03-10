"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const PoolInteraction_1 = require("../PoolInteraction");
class Model {
    async insert() {
        const properties = this.getProperties();
        const tableName = this.getTableName();
        const columns = [];
        const values = [];
        for (const key in properties) {
            if (typeof properties[key] !== 'function' && properties[key]['value'] !== undefined) {
                columns.push(key);
                values.push(properties[key]['value']);
            }
        }
        let query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES(`;
        for (let e of values) {
            e = this.getObjectValue(e);
            query += `'${e}',`;
        }
        const pool = PoolInteraction_1.PoolInteraction.getInstance();
        const result = await pool.query(`${query.slice(0, -1)}) RETURNING ${this.getIdParam()};`);
        //@ts-ignore
        this.id = result['rows'][0][this.getIdParam()];
        await this.listenerCallBack('insert');
    }
    async update() {
        const pool = PoolInteraction_1.PoolInteraction.getInstance();
        const properties = { ...this.getProperties() };
        const id = properties[this.getIdParam()]['value'];
        delete properties[this.getIdParam()];
        let query = `UPDATE ${this.getTableName()} SET `;
        for (const key in properties) {
            query += `${key} = \'${this.getObjectValue(properties[key]['value'])}\', `;
        }
        await pool.query(query.slice(0, -2) + ` WHERE ${this.getIdParam()} = ${id}`);
        await this.listenerCallBack('update');
    }
    async remove() {
        const pool = PoolInteraction_1.PoolInteraction.getInstance();
        const properties = { ...this.getProperties() };
        const id = properties[this.getIdParam()]['value'];
        await pool.query(`DELETE FROM ${this.getTableName()} WHERE ${this.getIdParam()} = ${id}`);
    }
    getObjectValue(value) {
        if (typeof value === 'object') {
            const isArray = Array.isArray(value);
            value = JSON.stringify(value);
            if (isArray) {
                value = value.replace('[', '{');
                value = value.replace(']', '}');
            }
        }
        return value;
    }
    getProperties() {
        return Object.getOwnPropertyDescriptors(this);
    }
    getTableName() {
        try {
            //@ts-ignore
            return this.constructor.getTableName();
        }
        catch (err) {
            throw Error('Model should have getTableName method');
        }
    }
    static instanceModelWithProperties(row) {
        const instance = Object.create(this.prototype);
        for (const key in row) {
            instance[key] = row[key];
        }
        return instance;
    }
    async listenerCallBack(type) { }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map