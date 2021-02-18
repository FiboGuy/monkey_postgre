import { Connection } from '../Connection'

export abstract class Model
{
    protected pool: Connection

    public constructor(pool: Connection){
        this.pool = pool
    }
}