import {PoolTest, createSchemaSql} from './../../lib'
import {TestTableModel} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'

describe.only('Model testing methods', () => {
    const poolTest = PoolTest.getInstance()
    const testTableModel = new TestTableModel(poolTest, 'lolo', [1,2,3], {'lolo': 3})
    
    it('Instance ok', () => {
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
        await testTableModel.insert()
        //const result = await poolTest.query('SELECT * FROM test_table WHERE title = \'lolo\'')
    })


    it('Should find and map properties to class', () => {

    })

    it('Should update row in database correctly', () => {

    })

    it('Should map properties correctly with an external query', () => {

    })
})
