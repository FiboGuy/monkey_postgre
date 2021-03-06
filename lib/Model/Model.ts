import { PoolInteraction } from '../PoolInteraction'

export abstract class Model
{
    protected pool: PoolInteraction
    private tableName: string

    public constructor()
    {
        this.pool = PoolInteraction.getInstance()
        this.tableName = this.getTableName()
    }

    public async insert<T>(): Promise<T>
    {
        const properties = this.getProperties()
        const columns: Array<any> = []
        const values: Array<any> = []
        for(const key in properties){
            if(typeof properties[key] !== 'function' && properties[key]['value'] !== undefined){
                columns.push(key)
                values.push(properties[key]['value'])
            }
        }
      
        let query = `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES(`
        for(let e of values){
            e = this.getObjectValue(e)
            query += `'${e}',`
        }

        const result = await this.pool.query(`${query.slice(0, -1)}) RETURNING ${this.getIdParam()};`)
        return result['rows'][0][this.getIdParam()]
    }

    public async update(): Promise<any>
    {
        if(!this.pool){
            this.pool = PoolInteraction.getInstance()
        }
        const properties = {...this.getProperties()}
        const id = properties[this.getIdParam()].value

        delete properties[this.getIdParam()]
        let query = `UPDATE ${this.getTableName()} SET `
   
        for(const key in properties){
            query += `${key} = \'${this.getObjectValue(properties[key]['value'])}\', `
        }
        
        const result = await this.pool.query(query.slice(0, -2) + ` WHERE ${this.getIdParam()} = ${id}`)
        return result
    }

    private getObjectValue(value: any): string|number
    {
        if(typeof value === 'object'){
            const isArray = Array.isArray(value)
            value = JSON.stringify(value)
            if(isArray){ 
                value = value.replace('[', '{')
                value = value.replace(']', '}')
            }
        }
        return value
    }


    private getProperties(): object
    {
        const properties = Object.getOwnPropertyDescriptors(this)
        delete properties['pool']
        delete properties['tableName']
      
        return properties
    }

    public getTableName(): string
    {
        try{
            //@ts-ignore
            return this.constructor.getTableName()
        }catch(err){
            throw Error('Model shouold have getTableName method')
        }
    }

    public static instanceModelWithProperties<T>(row: {}): T
    {
        const instance = Object.create(this.prototype)
        for(const key in row){
            instance[key] = row[key]
        }
        return instance
    }

    protected abstract getIdParam(): string
}