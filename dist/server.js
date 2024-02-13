"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const node_http_1 = __importDefault(require("node:http"));
const router_1 = require("./router/router");
const promises_1 = __importDefault(require("fs/promises"));
const startServer = async () => {
    process.on('SIGINT', async () => {
        await promises_1.default.writeFile('./src/storage/users.json', '[]');
        process.exit();
    });
    try {
        const server = node_http_1.default.createServer((request, response) => {
            const { url, method } = request;
            const sendResponse = async (data) => {
                let resp = await (0, router_1.router)(url, method, data);
                const { status, header, body } = resp;
                response.writeHead(status, header);
                response.end(body);
            };
            if (method === 'GET' || method === 'DELETE') {
                sendResponse(null);
            }
            else {
                request.on('data', (d) => {
                    const data = d.toString();
                    sendResponse(data);
                });
            }
        });
        server.listen(process.env);
    }
    catch {
        process.on('SIGINT', async () => {
            await promises_1.default.writeFile('./src/storage/users.json', '[]');
            process.exit();
        });
    }
};
exports.startServer = startServer;
