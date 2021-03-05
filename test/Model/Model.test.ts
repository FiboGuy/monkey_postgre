import {PoolInteraction, createSchemaSql} from './../../lib'
import {TestTableModel, TestTable2Model} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'
import { Test } from 'mocha'

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
        const result = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'sdasdsa'}) as any
        assert.isNull(result)
    })


    it('Should find and map properties to class', async () => {
        const testTableModel = new TestTableModel('lolo2', [1,2,3], {'lolo': 3})
        await testTableModel.insert()
        const result = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolo2'}) as any
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
        let result = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, {'title': ['lolo3', 'lolo4']}, {order: {title: 'DESC'}}) as any
        assert.isTrue(Array.isArray(result))
        assert.equal(result[0]['title'], 'lolo4')
        assert.equal(result[1]['title'], 'lolo3')
        //order and limit
        result = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, 
            {'title': ['lolo3', 'lolo4']}, {order: {title: 'ASC'}, limit: 1}) as any
        assert.isTrue(Array.isArray(result))
        assert.lengthOf(result, 1)
        assert.equal(result[0]['title'], 'lolo3')
    })

    it('Should map correctly without findby and update row in database correctly ', async () => {
        const testTableModel = new TestTableModel('lolito_update', [], {})
        await testTableModel.insert()
        const row = (await poolInteraction.query(`SELECT * FROM ${TestTableModel.getTableName()}`)).rows[0]
        const testTable = TestTableModel.instanceModelWithProperties<TestTableModel>(row)
        testTable.setTitle('lolito_updated')
        await testTable.update()
        let updatedRow = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolito_update'})
        assert.isNull(updatedRow)
        updatedRow = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolito_updated'}) as TestTableModel[]
        assert.isNotNull(updatedRow)
        assert.equal('lolito_updated', updatedRow[0].getTitle())
    })

    it.only('Test performance', async () => {
        let testTableModel = new TestTableModel('trolito', [], {})
        await testTableModel.insert()
        const x  = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'trolito'}) as TestTableModel[]
        testTableModel = x[0]
        let first = (new Date()).getTime()
        for(let i = 0; i< 10000; i++){
            testTableModel.setTitle('trolito'+i)
            await testTableModel.update()
        }
        let second = (new Date()).getTime()
        console.log((second - first)/1000)
        first = (new Date()).getTime()
        for(let i = 0; i< 10000; i++){
            await poolInteraction.query(`UPDATE test_table SET title = 'tralita${i}' WHERE id = ${testTableModel.getId()}`)
        }
        second = (new Date()).getTime()
        console.log((second - first)/1000)
    })
})
