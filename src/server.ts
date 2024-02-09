import http from 'node:http'
import { router } from './router/router';

export const startServer = () => {
    const server = http.createServer((request, response) => {
        const { url, method } = request;

        const { status, header, body } = router(url, method);
        response.writeHead(status, header);
        response.end(body);
    });
    server.listen(process.env);
}