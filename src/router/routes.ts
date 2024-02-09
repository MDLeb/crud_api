import { ACTIONS } from './actions'

export const ROUTES: { [key: string]: { [key: string]: Function } } = {
    '^/users/[\\w-]+$': {
        'GET': ACTIONS.getUserById,
        'POST': ACTIONS.addUser,
        'PUT': ACTIONS.updateUserById,
        'DELETE': ACTIONS.deleteUser
    },
    '^/users$': {
        'GET': ACTIONS.getAllUsers
    },
};
