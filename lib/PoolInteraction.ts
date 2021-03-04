import {Connection} from './Connection'
import { QueryResult, PoolClient } from 'pg'

export class PoolInteraction extends Connection{
    protected static instance: PoolInteraction|undefined = undefined

    public async query(sql: string): Promise<QueryResult>{
        return await this.pool.query(sql)
    }

    public async transaction(cb: (client: PoolClient) => Promise<void>): Promise<void>{
        const client = await this.pool.connect()
        client.query('BEGIN')
        try{
            await cb(client)
            client.query('COMMIT')
        }catch(err){
            client.query('ROLLBACK')
        }
        client.release()
    }

    public async findBy<T>(Model: any, params: object, options: {limit?: number, order?: {[key: string]: 'ASC'|'DESC'}} = {}): Promise<T[]|null>
    {
        let query = `SELECT * FROM ${Model.getTableName()}\n`
        let first = false
        for(const key in params){
            if(!first){
                query += `WHERE `
                first = true
            }else{
                query += `AND `
            }
            if(Array.isArray(params[key])){
                query += `(`
                for(const value of params[key]){
                    query += `${key} = '${value}' OR `
                }
                query = query.slice(0, -3) + ')\n'
            }else{
                query += `${key} = '${params[key]}'\n`
            }
        }
        if(options['order']){
            const key = Object.keys(options['order'])[0]
            query += `ORDER BY ${key} ${options['order'][key]}\n`
        }
        if(options['limit']){
            query += `LIMIT ${options['limit']}`
        }

        const result = await this.pool.query(query)
        const instances: T[] = []
        if(result.rows[0]){             
            for(const row of result.rows){
                instances.push(Model.instanceModelWithProperties(row))
            }
            return instances   
        }
        return null
    }

    public rollbackTesting(beforeCb: (() => void)|null = null, afterCb: (() => void)|null = null): void{
        if(!beforeCb){
            beforeCb = async () => await this.pool.query("BEGIN")
        }
        if(!afterCb){
            afterCb = async () => {
                await this.pool.query("ROLLBACK")
            }
        }
        before(beforeCb)
        after(afterCb)
    }
}