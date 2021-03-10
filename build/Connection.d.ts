import { Pool } from 'pg';
export declare class Connection {
    protected pool: Pool;
    protected static instance: any;
    protected constructor();
    static getInstance(): any;
    private createPool;
    getPool(): Pool;
    end(): void;
}
