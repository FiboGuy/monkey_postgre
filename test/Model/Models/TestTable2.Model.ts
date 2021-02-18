import { PoolTest } from '../../../lib'
import { Model } from '../../../lib/Model'

export class TestTable2Model extends Model
{
    private id: number|undefined
    private title: string

    public constructor(pool: PoolTest, title: string){
        super(pool)
        this.title = title
    }

    public static getSchema(): string{
        return `CREATE TABLE test_table2(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );`
    }
}