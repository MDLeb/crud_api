import http from 'node:http'
import userStorage from './userStorage';
import * as uuid from 'uuid';
import { router } from './router';

export const startServer = () => {
    const server = http.createServer((request, response) => {
        const { url, method } = request;
        console.log(url, method);
        
        const { status, header, body } = router(url, method);
        response.writeHead(status, header);
        response.end(body);
    });
    server.listen(process.env);
}