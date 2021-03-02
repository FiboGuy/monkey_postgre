import { PoolInteraction } from '../PoolInteraction'

export abstract class Model
{
    protected pool: PoolInteraction
    private properties: object|undefined
    private tableName: string

    public constructor()
    {
        this.pool = PoolInteraction.getInstance()
        this.tableName = this.getTableName()
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
      
        let query = `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES(`
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

    public mapPropertiesToModel(rows: any[]): void
    {
        const properties = this.getProperties()
    }

    private getProperties(): object
    {
        if(!this.properties){
            this.properties = Object.getOwnPropertyDescriptors(this)
            delete this.properties['pool']
            delete this.properties['properties']
            delete this.properties['tableName']
        }
        return this.properties
    }

    private getTableName(): string
    {
        try{
            //@ts-ignore
            return this.constructor.getTableName()
        }catch(err){
            throw Error('Model shouold have getTableName method')
        }
    }
}