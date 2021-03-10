import { PoolTest } from '../../../lib';
import { Model } from '../../../lib/Model';
export declare class TestTable2Model extends Model {
    private id;
    private title;
    constructor(pool: PoolTest, title: string);
    static getSchema(): string;
}
