import http from 'node:http'
import { router } from './router/router';
import cluster from 'cluster';
import { cpus, availableParallelism } from 'os';

const PORT = process.env.PORT || 4000;
const workers: any[] = [];
let nextWorker = 1;
console.log(PORT);


export const startMultiServer = () => {

    if (cluster.isPrimary) {
        console.log('PLEASE WAIT WHILE WORKERS STARTS');
        for (let i = 0; i < availableParallelism(); i++) {
            const new_worker_env = { PORT: +PORT + 1 + i };
            const worker = cluster.fork(new_worker_env);
            workers.push(worker);
        }
    }

    const server = http.createServer(async (request, response) => {

        try {
            const { url, method } = request;
            const sendResponse = (data: string | null) => router(url, method, data);//returns async

            if (cluster.isPrimary) {

                if (method === 'GET' || method === 'DELETE') {
                    workers[nextWorker].send({ type: 'request', data: { url, method, data: null } });
                } else {
                    request.on('data', (d) => {
                        const data = d.toString();
                        workers[nextWorker].send({ type: 'request', data: { url, method, data } });
                    })
                }

                cluster.once('message', (worker: any, message: any) => {
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
                        // response.writeHead(status, header);
                        // response.end(body);
                        // -----------
                    }
                } else {
                    request.on('data', async (d) => {
                        const data = d.toString();
                        const result = await sendResponse(data);
                        if (process.send) {
                            const { status, header, body } = result;
                            process.send({ type: 'response', status, header, body });
                            // тест ------
                            // response.writeHead(status, header);
                            // response.end(body);
                            // -----------
                        }
                    });
                }
            }
        } catch (error) {
            if (cluster.isPrimary) {
                response.writeHead(500, "Server error");
                response.end('{"message": "Server Error"}');
            } else {
                if (process.send) {
                    process.send({
                        type: 'response',
                        status: '500',
                        header: 'Content-Type: application/json',
                        body: '{"message": "Server Error"}'
                    });
                }
            }


        }
    });

    //при получении сообщения в чайлдпроцесс отправляем запрос на сервер, который на нем запущен
    if (!cluster.isPrimary) {
        process.on('message', (message: any) => {
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

            const req = http.request(options, (res) => {
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
}