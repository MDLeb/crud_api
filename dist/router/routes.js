"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = void 0;
const actions_1 = require("./actions");
exports.ROUTES = {
    '^/users/[\\w-]+/?$': {
        'GET': { action: actions_1.ACTIONS.getUserById, signature: ['id'] },
        'PUT': { action: actions_1.ACTIONS.updateUserById, signature: ['id', 'data'] },
        'DELETE': { action: actions_1.ACTIONS.deleteUser, signature: ['id'] }
    },
    '^/users/?$': {
        'GET': { action: actions_1.ACTIONS.getAllUsers, signature: [] },
        'POST': { action: actions_1.ACTIONS.addUser, signature: ['data'] }
    },
};
