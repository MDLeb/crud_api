import http from 'node:http'
import { router } from './router/router';

export const startServer = () => {
    const server = http.createServer((request, response) => {
        const { url, method } = request;

        if (method === 'GET') {
            const { status, header, body } = router(url, method, null);
            response.writeHead(status, header);
            response.end(body);
        } else {
            request.on('data', (d) => {
                const data = d.toString()
                const { status, header, body } = router(url, method, data);
                response.writeHead(status, header);
                response.end(body);
            })
        }
    });
    server.listen(process.env);
}