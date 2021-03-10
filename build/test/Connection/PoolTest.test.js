"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./../../lib");
const Connection_1 = require("./../../lib/Connection");
const chai_1 = require("chai");
describe('Database is connected correctly', () => {
    const poolInteraction = lib_1.PoolTest.getInstance();
    it('Is not possible to instance Connection', () => {
        chai_1.assert.equal(Connection_1.Connection.getInstance(), null);
    });
    it('PoolInteraction creates only one instance', () => {
        const poolInteraction2 = lib_1.PoolTest.getInstance();
        chai_1.assert.equal(poolInteraction, poolInteraction2);
    });
    it('Inserts data correctly', async () => {
        const data = await poolInteraction.query(`INSERT INTO test_table (title, arrs, jsons) 
        VALUES ('lolo', '{1,2,3}', '{"lolo":3}') RETURNING id`);
        chai_1.assert.isTrue("rows" in data);
        chai_1.assert.lengthOf(data.rows, 1);
        chai_1.assert.isTrue("id" in data.rows[0]);
    });
});
describe('PoolInteraction transaction', () => {
    const poolInteraction = lib_1.PoolInteraction.getInstance();
    after(() => {
        poolInteraction.end();
    });
    it('PoolInteraction creates only one instance', () => {
        const poolInteraction2 = lib_1.PoolInteraction.getInstance();
        chai_1.assert.equal(poolInteraction, poolInteraction2);
    });
    it('Transaction rollbacks correctly', async () => {
        await poolInteraction.transaction(async (client) => {
            await client.query(`INSERT INTO test_table (title, arrs, jsons) 
            VALUES ('rollback', '{1,2,3}', '{"lolo":3}') RETURNING id`);
            throw Error('Dummy error');
        });
        const result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'rollback'");
        chai_1.assert.equal(0, result.rows.length);
    });
    it('Transaction commits correctly', async () => {
        await poolInteraction.transaction(async (client) => {
            await client.query(`INSERT INTO test_table (title, arrs, jsons) 
            VALUES ('commit', '{1,2,3}', '{"lolo":3}') RETURNING id`);
        });
        let result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'commit'");
        chai_1.assert.equal(1, result.rows.length);
        await poolInteraction.query("DELETE FROM test_table WHERE title = 'commit'");
        result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'commit'");
        chai_1.assert.equal(0, result.rows.length);
    });
});
//# sourceMappingURL=PoolTest.test.js.map