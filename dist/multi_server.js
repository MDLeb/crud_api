"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMultiServer = void 0;
const node_http_1 = __importDefault(require("node:http"));
const router_1 = require("./router/router");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const PORT = process.env.PORT || 4000;
const workers = [];
let nextWorker = 1;
console.log(PORT);
const startMultiServer = () => {
    if (cluster_1.default.isPrimary) {
        for (let i = 0; i < (0, os_1.availableParallelism)(); i++) {
            const new_worker_env = { PORT: +PORT + 1 + i };
            const worker = cluster_1.default.fork(new_worker_env);
            workers.push(worker);
        }
    }
    const server = node_http_1.default.createServer(async (request, response) => {
        const { url, method } = request;
        const sendResponse = (data) => (0, router_1.router)(url, method, data); //returns async
        if (cluster_1.default.isPrimary) {
            if (method === 'GET' || method === 'DELETE') {
                workers[nextWorker].send({ type: 'request', data: { url, method, data: null } });
            }
            else {
                request.on('data', (d) => {
                    const data = d.toString();
                    workers[nextWorker].send({ type: 'request', data: { url, method, data } });
                });
            }
            cluster_1.default.once('message', (worker, message) => {
                if (message.type === 'response') {
                    const { status, header, body } = message;
                    response.writeHead(status, header);
                    response.end(body);
                }
            });
            nextWorker < Object.values(workers).length - 1 ?
                nextWorker++ : nextWorker = 1;
        }
        else {
            if (method === 'GET' || method === 'DELETE') {
                const result = await sendResponse(null);
                if (process.send) {
                    const { status, header, body } = result;
                    process.send({ type: 'response', status, header, body });
                    // тест ------
                    response.writeHead(status, header);
                    response.end(body);
                    // -----------
                }
            }
            else {
                request.on('data', async (d) => {
                    const data = d.toString();
                    const result = await sendResponse(data);
                    if (process.send) {
                        const { status, header, body } = result;
                        process.send({ type: 'response', status, header, body });
                        // тест ------
                        response.writeHead(status, header);
                        response.end(body);
                        // -----------
                    }
                });
            }
        }
    });
    //при получении сообщения в чайлдпроцесс отправляем запрос на сервер, который на нем запущен
    if (!cluster_1.default.isPrimary) {
        process.on('message', (message) => {
            const postData = JSON.stringify(message.data.data);
            const options = {
                hostname: 'localhost',
                port: PORT,
                path: message.data.url,
                method: message.data.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = node_http_1.default.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk.toString();
                });
                res.on('end', () => {
                    // console.log('end');
                });
            });
            req.on('error', (error) => {
                console.error(error);
            });
            message.data.data && req.write(message.data.data);
            req.end();
        });
    }
    server.listen(PORT);
};
exports.startMultiServer = startMultiServer;
