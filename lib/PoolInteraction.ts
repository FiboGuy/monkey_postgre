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
}