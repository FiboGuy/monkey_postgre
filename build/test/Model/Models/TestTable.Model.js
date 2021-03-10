"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTableModel = void 0;
const Model_1 = require("../../../lib/Model");
class TestTableModel extends Model_1.Model {
    constructor(pool, title, arrs, jsons) {
        super(pool);
        this.title = title;
        this.arrs = arrs;
        this.jsons = jsons;
    }
    static getSchema() {
        return `CREATE TABLE test_table(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            arrs  integer [] NOT NULL,
            jsons JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
    }
}
exports.TestTableModel = TestTableModel;
//# sourceMappingURL=TestTable.Model.js.map