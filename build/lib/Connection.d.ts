import pg from 'pg';
export declare class Connection {
    protected pool: pg.Pool;
    protected static instance: any;
    protected constructor();
    static getInstance(): any;
    private createPool;
    getPool(): pg.Pool;
    end(): void;
}
