import {Pool} from 'pg'
import {homedir} from 'os'
import * as fs from 'fs'

export class Connection{
    protected pool: Pool
    protected static instance: any = null
    
    protected constructor(){
        this.pool = this.createPool()
    }

    public static getInstance(): any {
        if(this.instance === undefined) {
            this.instance = new this()
        }
        return this.instance
    }

    private createPool(): Pool{
        const config = `${homedir}/.monkey_config.json`
        if(fs.existsSync(config)){
            const { host, user, password, database, port = 5432 } = JSON.parse(fs.readFileSync(config, 'utf-8'))['db']
            return new Pool({
                host,
                user,
                password,
                database,
                port
            })
        }
        throw new Error('No config file database found')
    }

    public getPool(): Pool{
        return this.pool
    }

    public end(): void{
        this.pool.end()
    }
}

