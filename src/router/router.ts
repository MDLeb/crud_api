import { ROUTES } from './routes'

export const router = (path: string | undefined, method: string | undefined) => {
    console.log(path);
    let action: Function | undefined = undefined;;

    for (const route in ROUTES) {
        const regex = new RegExp(route);
        if (regex.test(path || '')) {
            const routeObject = ROUTES[route];
            if (method && routeObject.hasOwnProperty(method)) {
                action = routeObject[method];
                break;
            }
        }
    }
    if (!action) {
        return {
            status: 404,
            header: 'Content-Type: application/json',
            body: JSON.stringify({ error: 'Not Found' }),
        };
    } else {
        return {
            status: 200,
            header: 'Content-Type: application/json',
            body: JSON.stringify({ msg: 'Works' }),
        }
    }

}