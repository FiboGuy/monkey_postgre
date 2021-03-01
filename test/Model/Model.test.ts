import {PoolInteraction, createSchemaSql} from './../../lib'
import {TestTableModel} from './Models'
import {Model} from '../../lib/Model'
import {assert} from 'chai'
import * as fs from 'fs'

describe('Model testing methods', () => {
    const poolInteraction = PoolInteraction.getInstance()
    poolInteraction.rollbackTesting()
    const testTableModel = new TestTableModel(poolInteraction, 'lolo', [1,2,3], {'lolo': 3})
    
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
        const result = await poolInteraction.query('SELECT * FROM test_table WHERE title = \'lolo\'')
        assert.isTrue(result.rows.length == 1)
    })


    it('Should find and map properties to class', async () => {
        const result = await testTableModel.findBy({'title': 'lolo'}, {order: {title: 'ASC'}, limit: 1})
        console.log(result)
    })

    it('Should update row in database correctly', () => {

    })

    it('Should map properties correctly with an external query', () => {

    })
})
