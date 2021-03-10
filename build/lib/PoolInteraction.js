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
            client.query('ROLLBACK');
        }
        client.release();
    }
}
exports.PoolInteraction = PoolInteraction;
PoolInteraction.instance = undefined;
//# sourceMappingURL=PoolInteraction.js.map