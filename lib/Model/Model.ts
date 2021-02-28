import { PoolClient } from 'pg'
import { Connection } from '../Connection'
import {Pool} from 'pg'

export abstract class Model
{
    protected pool: Pool

    public constructor(pool: Connection){
        this.pool = pool.getPool()
    }

    public async insert(): Promise<void>{
        const properties = Object.getOwnPropertyDescriptors(this)
        delete properties['pool']
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

    protected abstract getTableName():string
}