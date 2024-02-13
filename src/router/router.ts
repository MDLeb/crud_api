import { ROUTES } from './routes'
import * as nodePath from 'node:path';

export const router = (path: string | undefined, method: string | undefined, data: any) => {

    let action: Function | undefined = undefined;
    let signature: String[] = [];

    let params = nodePath.parse(path as string).base;

    for (const route in ROUTES) {
        const regex = new RegExp(route);
        if (regex.test(path || '')) {
            const routeObject = ROUTES[route];
            if (method && routeObject.hasOwnProperty(method)) {
                let existingRoute = routeObject[method];
                existingRoute && (action = existingRoute['action'], signature = existingRoute['signature']);
                break;
            }
        }
    }
    if (!action) {
        return {
            status: 404,
            header: 'Content-Type: application/json',
            body: JSON.stringify({ error: 'Not Found, incorrect url' }),
        };
    } else {
        return action(...signature.map(i => {
           if(i === 'id') return params;
           if(i === 'data') return data;
        }))
    }

}