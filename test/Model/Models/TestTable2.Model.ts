import { PoolTest } from '../../../lib'
import { Model } from '../../../lib/Model'

export class TestTable2Model extends Model
{
    private id: number|undefined
    private title: string
    private testTable: number

    public constructor(pool: PoolTest, title: string, testTable: number){
        super(pool)
        this.title = title
        this.testTable = testTable
    }

    public getId(){
        return this.id
    }

    public getTitle(){
        return this.title
    }

    public getTestTable(){
        return this.testTable
    }

    public static getSchema(): string{
        return `
            CREATE TABLE test_table2(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );  
            ALTER TABLE test_table2
            ADD COLUMN test_table_id INT,
            ADD CONSTRAINT fk_test_table
            FOREIGN KEY(test_table_id)
            REFERENCES test_table(id)
            ON DELETE SET NULL;   
          `
    }
}