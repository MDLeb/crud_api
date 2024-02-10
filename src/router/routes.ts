import { ACTIONS } from './actions'

export const ROUTES: { [key: string]: { [key: string]: {'action': Function, 'signature': String[]} } } = {
    '^/users/[\\w-]+/?$': {
        'GET': { action: ACTIONS.getUserById, signature: ['id'] },
        'PUT': { action: ACTIONS.updateUserById, signature: ['id', 'data'] },
        'DELETE': { action: ACTIONS.deleteUser, signature: ['id'] }
    },
    '^/users/?$': {
        'GET': { action: ACTIONS.getAllUsers, signature: [] },
        'POST': { action: ACTIONS.addUser, signature: ['data'] }
    },
};
