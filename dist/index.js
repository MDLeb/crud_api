"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const dotenv_1 = __importDefault(require("dotenv"));
const cluster_1 = __importDefault(require("cluster"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multi_server_1 = require("./multi_server");
const userStorage_1 = require("./userStorage");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const isMulti = process.argv.find(i => i.startsWith('--MULTI_SERVER'))?.replace('--MULTI_SERVER=', '') ?? false;
global.UserStorage = new userStorage_1.UserStorage();
if (cluster_1.default.isPrimary) {
    fs_1.default.writeFile(path_1.default.resolve('./src', 'users.json'), '[]', {}, () => { });
}
isMulti ? (0, multi_server_1.startMultiServer)() : (0, server_1.startServer)();
