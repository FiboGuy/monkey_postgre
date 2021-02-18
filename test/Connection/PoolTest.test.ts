import {PoolTest, PoolInteraction} from './../../lib'
import {Connection} from './../../lib/Connection'
import {assert} from 'chai'

describe('Database is connected correctly', () => {
    const poolInteraction: PoolTest = PoolTest.getInstance()

    it('Is not possible to instance Connection', () => {
        assert.equal(Connection.getInstance(), null)
    })

    it('PoolInteraction creates only one instance', () => {
        const poolInteraction2: PoolTest = PoolTest.getInstance()
        assert.equal(poolInteraction, poolInteraction2)
    })
 
    it('Inserts data correctly', async () => {
        const data = await poolInteraction.query(`INSERT INTO test_table (title, arrs, jsons) 
        VALUES ('lolo', '{1,2,3}', '{"lolo":3}') RETURNING id`)
        assert.isTrue("rows" in data)
        assert.lengthOf(data.rows, 1)
        assert.isTrue("id" in data.rows[0])
    })
})

describe('PoolInteraction transaction', () => {
    const poolInteraction: PoolInteraction = PoolInteraction.getInstance()

    after(() => {
        poolInteraction.end()
    })

    it('PoolInteraction creates only one instance', () => {
        const poolInteraction2: PoolInteraction = PoolInteraction.getInstance()
        assert.equal(poolInteraction, poolInteraction2)
    })

    it('Transaction rollbacks correctly', async () => {
        await poolInteraction.transaction(async client => {
            await client.query(`INSERT INTO test_table (title, arrs, jsons) 
            VALUES ('rollback', '{1,2,3}', '{"lolo":3}') RETURNING id`)
            throw Error('Dummy error')
        })
        const result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'rollback'")
        assert.equal(0, result.rows.length)
    })

    it('Transaction commits correctly', async () => {
        await poolInteraction.transaction(async client => {
            await client.query(`INSERT INTO test_table (title, arrs, jsons) 
            VALUES ('commit', '{1,2,3}', '{"lolo":3}') RETURNING id`)
        })
        let result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'commit'")
        assert.equal(1, result.rows.length)
        await poolInteraction.query("DELETE FROM test_table WHERE title = 'commit'")
        result = await poolInteraction.query("SELECT * FROM test_table WHERE title = 'commit'")
        assert.equal(0, result.rows.length)
    })
})