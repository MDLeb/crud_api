import http from 'node:http'
import { router } from './router/router';

export const startServer = async () => {
    const server = http.createServer((request, response) => {

        try {
            const { url, method } = request;
            const sendResponse = async (data: string | null) => {
                try {
                    let resp = await router(url, method, data);
                    const { status, header, body } = resp;
                    response.writeHead(status, header);
                    response.end(body);
                } catch (error) {
                    response.writeHead(500, "Server error");
                    response.end('{"message": "Server Error"}');
                }
            }

            if (method === 'GET' || method === 'DELETE') {
                sendResponse(null);
            } else {
                request.on('data', (d) => {
                    const data = d.toString()
                    sendResponse(data);
                })
            }
        }
        catch (error) {
            response.writeHead(500, "Server error");
            response.end();
        }

    });
    server.listen(process.env);
}

