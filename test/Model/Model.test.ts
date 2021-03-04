import {PoolInteraction, createSchemaSql} from './../../lib'
import {TestTableModel, TestTable2Model} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'

describe.only('Model testing methods', () => {
    const poolInteraction:PoolInteraction = PoolInteraction.getInstance()
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

    it('Find shoult return null when no rows in database', async () => {
        const result = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'sdasdsa'}) as null
        assert.isNull(result)
    })


    it('Should find and map properties to class', async () => {
        const testTableModel = new TestTableModel('lolo2', [1,2,3], {'lolo': 3})
        await testTableModel.insert()
        const result = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolo2'})
        assert.isTrue(Array.isArray(result))
        assert.isTrue(result[0] instanceof TestTableModel)
    })

    it('Should find all results with conditions', async () => {
        const testTableModel = new TestTableModel('lolito', [], {})
        const testTableId: number = await testTableModel.insert<number>()
        const testTable2Model = new TestTable2Model('lolo3', testTableId)
        const testTable2Model2 = new TestTable2Model('lolo4', testTableId)
        await testTable2Model.insert()
        await testTable2Model2.insert()
        let result = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, {'title': ['lolo3', 'lolo4']}, {order: {title: 'DESC'}})
        assert.isTrue(Array.isArray(result))
        assert.equal(result[0]['title'], 'lolo4')
        assert.equal(result[1]['title'], 'lolo3')
        //order and limit
        result = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, 
            {'title': ['lolo3', 'lolo4']}, {order: {title: 'ASC'}, limit: 1})
        assert.isTrue(Array.isArray(result))
        assert.isTrue(result.length === 1)
        console.log('entra')
        assert.equal(result[0]['title'], 'lolo3')
    })

    it('Should limit to 1 correctly', async () => {
       
    })


    it('Should update row in database correctly', () => {

    })

    it('Should map properties correctly with an external query', () => {

    })
})
