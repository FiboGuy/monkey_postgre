export declare abstract class Model {
    insert(): Promise<void>;
    update(): Promise<void>;
    remove(): Promise<void>;
    private getObjectValue;
    private getProperties;
    getTableName(): string;
    static instanceModelWithProperties<T>(row: {}): T;
    protected listenerCallBack(type: 'insert' | 'update'): Promise<void>;
    protected abstract getIdParam(): string;
}
