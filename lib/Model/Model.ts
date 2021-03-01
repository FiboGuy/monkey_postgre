import { PoolInteraction } from '../PoolInteraction'

export abstract class Model
{
    protected pool: PoolInteraction
    private properties: object|undefined

    public constructor(pool: PoolInteraction)
    {
        this.pool = pool
    }

    public async insert(): Promise<void>
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
      
        let query = `INSERT INTO ${this.getTableName()} (${columns.join(',')}) VALUES(`
        for(let e of values){
            if(typeof e === 'object'){
                const isArray = Array.isArray(e)
                e = JSON.stringify(e)
                if(isArray){ 
                    e = e.replace('[', '{')
                    e = e.replace(']', '}')
                }
            }
            query += `\'${e}\',`
        }

        try{
            await this.pool.query(`${query.slice(0, -1)})`)
        }catch(err){
            console.log(err)
        }
    }

    public async findBy(params: object, options: {limit?: number, order?: {[key: string]: 'ASC'|'DESC'}} = {}): Promise<object|null>
    {
        let query = `SELECT * FROM ${this.getTableName()}\n`
        let first = false
        for(const key in params){
            if(!first){
                query += `WHERE `
                first = true
            }else{
                query += `AND `
            }
            query += `${key} = '${params[key]}'\n`
        }
        if(options['order']){
            const key = Object.keys(options['order'])[0]
            query += `ORDER BY ${key} ${options['order'][key]}\n`
        }
        if(options['limit']){
            query += `LIMIT ${options['limit']}`
        }
        console.log(query)
        const result = await this.pool.query(query)
        console.log(result)
        return result
    }

    public mapPropertiesToModel(rows: any[]): void
    {

    }

    private getProperties(): object
    {
        if(!this.properties){
            this.properties = Object.getOwnPropertyDescriptors(this)
            delete this.properties['pool']
            delete this.properties['properties']
        }
        return this.properties
    }
    protected abstract getTableName():string
}