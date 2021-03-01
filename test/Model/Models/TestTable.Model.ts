import { PoolInteraction } from '../../../lib'
import { Model } from '../../../lib/Model'

export class TestTableModel extends Model
{
    private id: number|undefined
    private title: string
    private arrs: Array<number>
    private jsons: object
    private createdAt: string|undefined

    public constructor(pool: PoolInteraction, title: string, arrs: Array<number>, jsons: object){
        super(pool)
        this.title = title
        this.arrs = arrs
        this.jsons = jsons
    }

    public getId(){
        return this.id
    }

    public getTitle(){
        return this.title
    }

    public getArrs(){
        return this.arrs
    }
    
    public getJsons(){
        return this.jsons
    }

    public getCreatedAt(){
        return this.createdAt
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

    protected getTableName(): string{
        return 'test_table'
    }
}