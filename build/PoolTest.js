"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolTest = void 0;
const PoolInteraction_1 = require("./PoolInteraction");
class PoolTest extends PoolInteraction_1.PoolInteraction {
    constructor() {
        super();
        this.callTestingEvent();
    }
    callTestingEvent() {
        before(async () => {
            await this.pool.query("BEGIN");
        });
        after(async () => {
            await this.pool.query("ROLLBACK");
        });
    }
}
exports.PoolTest = PoolTest;
PoolTest.instance = undefined;
//# sourceMappingURL=PoolTest.js.map