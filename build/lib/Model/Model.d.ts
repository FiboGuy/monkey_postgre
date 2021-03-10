import { Connection } from '../Connection';
export declare abstract class Model {
    protected pool: Connection;
    constructor(pool: Connection);
}
