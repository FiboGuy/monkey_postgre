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
exports.createSchemaSql = void 0;
const fs = __importStar(require("fs"));
function createSchemaSql(baseDir, outDir) {
    if (!baseDir || !outDir) {
        console.log('Missing args baseDir and/or outDir');
        process.exit(1);
    }
    let models;
    if (fs.lstatSync(baseDir).isDirectory()) {
        models = getAllModelsInDirectory(baseDir);
    }
    else {
        console.log('baseDir not a directory');
        process.exit(1);
    }
    models.forEach(e => {
        const model = Object.values(require(e))[0];
        try {
            fs.appendFileSync(outDir, model.getSchema() + '\n');
        }
        catch (err) {
            console.log(err.message);
            process.exit(1);
        }
    });
}
exports.createSchemaSql = createSchemaSql;
function getAllModelsInDirectory(dir) {
    const models = [];
    if (fs.lstatSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach(e => {
            models.push(...getAllModelsInDirectory(`${dir}/${e}`));
        });
    }
    else if (fs.lstatSync(dir).isFile()) {
        if ((/.+\.Model\.ts/).test(dir)) {
            models.push(dir);
        }
    }
    return models;
}
function getArgs() {
    const args = process.argv.filter(e => {
        return e.indexOf('--') === 0;
    });
    const result = {};
    args.forEach(e => {
        const element = e.replace('--', '').split('=');
        result[element[0]] = element[1];
    });
    return result;
}
const args = getArgs();
if ('baseDir' in args && 'outDir' in args) {
    createSchemaSql(args['baseDir'], args['outDir']);
}
//# sourceMappingURL=SchemaCreator.js.map