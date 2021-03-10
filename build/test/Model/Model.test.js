"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./../../lib");
const Models_1 = require("./Models");
const Model_1 = require("../../lib/Model");
const chai_1 = require("chai");
const fs = __importStar(require("fs"));
describe.only('Model testing methods', () => {
    const poolTest = lib_1.PoolTest.getInstance();
    const testTableModel = new Models_1.TestTableModel(poolTest, 'lolo', [1, 2, 3], {});
    it('Instance ok', () => {
        chai_1.assert.isTrue(testTableModel instanceof Model_1.Model);
    });
    it('Create mysql schema correctly', () => {
        const baseDir = `${__dirname}/Models`;
        const outDir = `${__dirname}/schema.sql`;
        lib_1.createSchemaSql(baseDir, outDir);
        chai_1.assert.isTrue(fs.lstatSync(outDir).isFile());
        fs.readFile(outDir, 'utf-8', (err, content) => {
            chai_1.assert.typeOf(content, 'string');
        });
        fs.rmSync(outDir);
    });
    it('Should insert database properties', () => {
    });
    it('Should find and map properties to class', () => {
    });
    it('Should update row in database correctly', () => {
    });
    it('Should map properties correctly with an external query', () => {
    });
});
//# sourceMappingURL=Model.test.js.map