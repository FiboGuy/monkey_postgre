import {PoolInteraction, createSchemaSql} from './../../lib'
import {TestTableModel, TestTable2Model} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'

describe('Model testing methods', () => {
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
        await testTableModel.insert()
        const testTable2Model = new TestTable2Model('lolo3', testTableModel.getId() as number)
        const testTable2Model2 = new TestTable2Model('lolo4', testTableModel.getId() as number)
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
        const row = (await poolInteraction.query(`SELECT * FROM ${TestTableModel.getTableName()} WHERE id = ${testTableModel.getId()}`)).rows[0]
        const testTable = TestTableModel.instanceModelWithProperties<TestTableModel>(row)
        testTable.setTitle('lolito_updated')
        await testTable.update()
        let updatedRow = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolito_update'})
        assert.isNull(updatedRow)
        updatedRow = await poolInteraction.findBy<TestTableModel>(TestTableModel, {'title': 'lolito_updated'}) as TestTableModel[]
        assert.isNotNull(updatedRow)
        assert.equal('lolito_updated', updatedRow[0].getTitle())
    })

    it('Should remove row from database correctly', async() => {
        const testTable = new TestTableModel('remove', [], {})
        await testTable.insert()
        let row = await poolInteraction.findBy(TestTableModel, {'id': testTable.getId()})
        await testTable.remove()
        row = await poolInteraction.findBy(TestTableModel, {'id': testTable.getId()})
        assert.isNull(row)
    })

    it('Should trigger listener when update or insert it\'s set or do anything if not', async () => {
        const testTable = new TestTableModel('trigger_insert', [], {})
        await testTable.insert()
        //We made a new testTableModel2 to trigger when inserted
        let testTable2 = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, {'test_table_id': testTable.getId()}) as TestTable2Model[]
        assert.isNotNull(testTable2)
        assert.equal('trigger_inserted', testTable2[0].getTitle())
        //Check update triggers 
        testTable.setTitle('trigger_update')
        await testTable.update()
        testTable2 = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, {'test_table_id': testTable.getId()}) as TestTable2Model[]  
        assert.equal('trigger_updated', testTable2[0].getTitle())
        //Nothing breaks here
        await testTable2[0].remove()
        const newRow = new TestTable2Model('lolito', testTable.getId() as number)
        await newRow.insert()
        assert.isNull(null)
    })

        // it.only('Test performance again', async () => {
        //     for(let j = 0; j<10; j++){
        //         const first = (new Date()).getTime()
        //         for(let i = 0; i< 10000; i++){
        //             const testTable = new TestTableModel(`dsadas${i}ds${j}`, [], {'lolo':'a'})
        //             await testTable.insert()
        //         }
        //         const second = (new Date()).getTime()
        //         console.log((second - first)/1000)

        //     }
            
        // })
})
