import { PoolTest } from '../../../lib'
import { Model } from '../../../lib/Model'

export class TestTableModel extends Model
{
    private id: number|undefined
    private title: string
    private arrs: Array<number>
    private jsons: object
    private created_at: string|undefined

    public constructor(pool: PoolTest, title: string, arrs: Array<number>, jsons: object){
        super(pool)
        this.title = title
        this.arrs = arrs
        this.jsons = jsons
    }

    public static getSchema(): string{
        return `CREATE TABLE test_table(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            arrs  integer [] NOT NULL,
            jsons JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    }
}