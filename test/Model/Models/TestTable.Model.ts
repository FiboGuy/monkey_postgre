import { Model } from '../../../lib/Model'
import { TestTable2Model } from '.'
import { PoolInteraction } from './../../../lib'

export class TestTableModel extends Model
{
    private id: number|undefined
    private title: string
    private arrs: number[]
    private jsons: object
    private created_at: string|undefined

    public constructor(title: string, arrs: number[], jsons: object){
        super()
        this.title = title
        this.arrs = arrs
        this.jsons = jsons
    }

    public getId(): number|undefined{
        return this.id
    }

    public getTitle(){
        return this.title
    }

    public setTitle(title: string){
        this.title = title
    }

    public getArrs(){
        return this.arrs
    }

    public setArrs(arrs: number[]){
        this.arrs = arrs
    }
    
    public getJsons(){
        return this.jsons
    }

    public setJsons(jsons: object){
        this.jsons = jsons
    }

    public getCreated_at(){
        return this.created_at
    }

    public static getSchema(): string{
        return `
            CREATE TABLE test_table(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            arrs  integer [] NOT NULL,
            jsons JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    }

    public static getTableName(): string{
        return 'test_table'
    }

    protected getIdParam(): string
    {
        return 'id'
    }

    protected async listenerCallBack(type: 'insert'|'update'): Promise<void>
    {
        if(type === 'insert' && this.title === 'trigger_insert'){
            const testTable2 = new TestTable2Model('trigger_inserted', this.id as number)
            await testTable2.insert()
        }else{
            if(this.title === 'trigger_update'){
                const poolInteraction: PoolInteraction = PoolInteraction.getInstance()
                const testTable2 = await poolInteraction.findBy<TestTable2Model>(TestTable2Model, {'title': 'trigger_inserted'}) as TestTable2Model[]
                testTable2[0].setTitle('trigger_updated')
                await testTable2[0].update()
            }
        }  
    }
}