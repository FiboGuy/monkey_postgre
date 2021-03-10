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
exports.Connection = void 0;
const pg_1 = require("pg");
const os_1 = require("os");
const fs = __importStar(require("fs"));
class Connection {
    constructor() {
        this.pool = this.createPool();
    }
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new this();
        }
        return this.instance;
    }
    createPool() {
        const config = `${os_1.homedir}/.monkey_config.json`;
        if (fs.existsSync(config)) {
            const { host, user, password, database, port = 5432 } = JSON.parse(fs.readFileSync(config, 'utf-8'))['db'];
            return new pg_1.Pool({
                host,
                user,
                password,
                database,
                port
            });
        }
        throw new Error('No config file database found');
    }
    getPool() {
        return this.pool;
    }
    end() {
        this.pool.end();
    }
}
exports.Connection = Connection;
Connection.instance = null;
//# sourceMappingURL=Connection.js.map