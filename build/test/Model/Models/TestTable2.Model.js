"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTable2Model = void 0;
const Model_1 = require("../../../lib/Model");
class TestTable2Model extends Model_1.Model {
    constructor(pool, title) {
        super(pool);
        this.title = title;
    }
    static getSchema() {
        return `CREATE TABLE test_table2(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );`;
    }
}
exports.TestTable2Model = TestTable2Model;
//# sourceMappingURL=TestTable2.Model.js.map