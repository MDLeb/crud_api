import http from 'node:http'
import { router } from './router/router';

export const startServer = () => {
    const server = http.createServer((request, response) => {
        const { url, method } = request;

        const sendResponse = async (data: string | null) => {
            let resp = await router(url, method, data);
            const { status, header, body } = resp;
            response.writeHead(status, header);
            response.end(body);
        }
        

        if (method === 'GET' || method === 'DELETE') {
            sendResponse(null);
        } else {
            request.on('data', (d) => {
                const data = d.toString()
                sendResponse(data);
            })
        }
    });
    server.listen(process.env);
}