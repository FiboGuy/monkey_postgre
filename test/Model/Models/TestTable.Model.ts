import { Model } from '../../../lib/Model'

export class TestTableModel extends Model
{
    private id: number|undefined
    private title: string
    private arrs: number[]
    private jsons: object
    private createdAt: string|undefined

    public constructor(title: string, arrs: number[], jsons: object){
        super()
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

    public static getTableName(): string{
        return 'test_table'
    }
}