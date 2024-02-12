"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const node_http_1 = __importDefault(require("node:http"));
const router_1 = require("./router/router");
const startServer = () => {
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
};
exports.startServer = startServer;
