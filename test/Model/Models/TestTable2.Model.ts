import { Model } from '../../../lib/Model'

export class TestTable2Model extends Model
{
    private id: number|undefined
    private title: string
    private test_table_id: number

    public constructor(title: string, test_table_id: number){
        super()
        this.title = title
        this.test_table_id = test_table_id
    }

    public getId(){
        return this.id
    }

    public getTitle(){
        return this.title
    }

    public setTitle(title: string){
        this.title = title
    }

    public getTest_table_id(){
        return this.test_table_id
    }

    public setTest_table_id(testTable: number){
        this.test_table_id = testTable
    }

    public static getSchema(): string{
        return `
            CREATE TABLE test_table2(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );  
            ALTER TABLE test_table2
            ADD COLUMN test_table_id INT NOT NULL,
            ADD CONSTRAINT fk_test_table
            FOREIGN KEY(test_table_id)
            REFERENCES test_table(id)
            ON DELETE SET NULL;   
          `
    }

    public static getTableName(): string{
        return 'test_table2'
    }

    protected getIdParam(): string
    {
        return 'id'
    }
}