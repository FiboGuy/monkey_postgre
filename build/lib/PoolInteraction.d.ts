import { Connection } from './Connection';
import { QueryResult, PoolClient } from 'pg';
export declare class PoolInteraction extends Connection {
    protected static instance: PoolInteraction | undefined;
    query(sql: string): Promise<QueryResult>;
    transaction(cb: (client: PoolClient) => Promise<void>): Promise<void>;
}
