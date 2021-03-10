import { PoolTest } from '../../../lib';
import { Model } from '../../../lib/Model';
export declare class TestTableModel extends Model {
    private id;
    private title;
    private arrs;
    private jsons;
    private created_at;
    constructor(pool: PoolTest, title: string, arrs: Array<number>, jsons: object);
    static getSchema(): string;
}
