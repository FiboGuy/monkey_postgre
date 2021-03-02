import {PoolInteraction, createSchemaSql} from './../../lib'
import {TestTableModel} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'

describe('Model testing methods', () => {
    const poolInteraction = PoolInteraction.getInstance()
    poolInteraction.rollbackTesting()
    
    
    it('Instance ok', () => {
        const testTableModel = new TestTableModel('lolo', [1,2,3], {'lolo': 3})
        assert.isTrue(testTableModel instanceof Model)
    })

    it('Create mysql schema correctly', () => {
        const baseDir = `${__dirname}/Models`
        const outDir = `${__dirname}/schema.sql`
        createSchemaSql(baseDir, outDir)
        assert.isTrue(fs.lstatSync(outDir).isFile())
        fs.readFile(outDir, 'utf-8', (err, content) => {
           assert.typeOf(content, 'string')
        })
        
        fs.rmSync(outDir)
    })

    it('Should insert database properties', async () => {
        const testTableModel = new TestTableModel('lolo', [1,2,3], {'lolo': 3})
        await testTableModel.insert()
        const result = await poolInteraction.query('SELECT * FROM test_table WHERE title = \'lolo\'')
        assert.isTrue(result.rows.length == 1)
    })

    // it.only('Find shoult return null when no rows in database', async () => {
    //     const result = await poolInteraction.findBy(TestTableModel, {'title': 'sdasdsa'})
    //     assert.isNull(result)
    // })


    // it('Should find and map properties to class', async () => {
    //     const testTableModel = new TestTableModel('lolo2', [1,2,3], {'lolo': 3})
    //     await testTableModel.insert()
    //     const result = await poolInteraction.findBy({'title': 'lolo2'}, {order: {title: 'ASC'}, limit: 1})
    // })

    it('Should update row in database correctly', () => {

    })

    it('Should map properties correctly with an external query', () => {

    })
})
