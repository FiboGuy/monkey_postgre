import { PoolInteraction } from '../PoolInteraction'

export abstract class Model
{
    public async insert(): Promise<void>
    {
        const properties = this.getProperties()
        const tableName = this.getTableName()
        const columns: Array<any> = []
        const values: Array<any> = []
        for(const key in properties){
            if(typeof properties[key] !== 'function' && properties[key]['value'] !== undefined){
                columns.push(key)
                values.push(properties[key]['value'])
            }
        }
      
        let query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES(`
        for(let e of values){
            e = this.getObjectValue(e)
            query += `'${e}',`
        }
        const pool = PoolInteraction.getInstance()
        const result = await pool.query(`${query.slice(0, -1)}) RETURNING ${this.getIdParam()};`)
        //@ts-ignore
        this.id = result['rows'][0][this.getIdParam()]
        await this.listenerCallBack('insert')
    }

    public async update(): Promise<void>
    {
        const pool = PoolInteraction.getInstance()
        const properties = {...this.getProperties()}
        const id = properties[this.getIdParam()]['value']

        delete properties[this.getIdParam()]
        let query = `UPDATE ${this.getTableName()} SET `
   
        for(const key in properties){
            query += `${key} = \'${this.getObjectValue(properties[key]['value'])}\', `
        }

        await pool.query(query.slice(0, -2) + ` WHERE ${this.getIdParam()} = ${id}`)
        await this.listenerCallBack('update')
    }

    public async remove(): Promise<void>
    {
        const pool = PoolInteraction.getInstance()
        const properties = {...this.getProperties()}
        const id = properties[this.getIdParam()]['value']
        await pool.query(`DELETE FROM ${this.getTableName()} WHERE ${this.getIdParam()} = ${id}`)
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
        return Object.getOwnPropertyDescriptors(this)
    }

    public getTableName(): string
    {
        try{
            //@ts-ignore
            return this.constructor.getTableName()
        }catch(err){
            throw Error('Model should have getTableName method')
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

    protected async listenerCallBack(type: 'insert'|'update'): Promise<void>
    {}

    protected abstract getIdParam(): string
}