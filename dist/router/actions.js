"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIONS = void 0;
const uuid = __importStar(require("uuid"));
const userStorage_1 = __importDefault(require("../userStorage"));
const isUUID_1 = require("../utils/isUUID");
const isNumber_1 = require("../utils/isNumber");
const isString_1 = require("../utils/isString");
const isArrayOfStrings_1 = require("../utils/isArrayOfStrings");
exports.ACTIONS = {
    'getAllUsers': async () => {
        const users = await userStorage_1.default.getAllUsers();
        return {
            status: 200,
            header: 'Content-Type: application/json',
            body: JSON.stringify(users),
        };
    },
    'getUserById': async (id) => {
        if (!(0, isUUID_1.isUUID)(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            };
        }
        const user = await userStorage_1.default.getUserById(id);
        if (!user) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            };
        }
        else {
            return {
                status: 200,
                header: 'Content-Type: application/json',
                body: JSON.stringify(user),
            };
        }
    },
    'updateUserById': async (id, userProps) => {
        if (!(0, isUUID_1.isUUID)(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            };
        }
        const userKeys = Object.keys(userProps);
        for (let key in userProps) {
            if (!userKeys.includes(key)) {
                return {
                    status: 400,
                    header: 'Content-Type: application/json',
                    body: JSON.stringify({ message: 'request body fields do not match to type User' }),
                };
            }
        }
        if ((userProps.name && !(0, isString_1.isString)(userProps.name)) ||
            (userProps.age && !(0, isNumber_1.isNumber)(userProps.age)) ||
            (userProps.hobbies && !(0, isArrayOfStrings_1.isArrayOfStrings)(userProps.hobbies))) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            };
        }
        const isOperationSucced = await userStorage_1.default.updateUserById(id, userProps);
        if (!isOperationSucced) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            };
        }
        else {
            return {
                status: 204,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `user with id ${id} removed successfully` }),
            };
        }
    },
    'addUser': async (user) => {
        console.log(user);
        try {
            user = JSON.parse(user);
        }
        catch {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'wrong request' }),
            };
        }
        console.log(user);
        if (!("username" in user) || !("age" in user) || !("hobbies" in user)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body does not contain required fields' }),
            };
        }
        if (!(0, isString_1.isString)(user.username) || !(0, isNumber_1.isNumber)(user.age) || !(0, isArrayOfStrings_1.isArrayOfStrings)(user.hobbies)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            };
        }
        ;
        Object.assign(user, {
            id: uuid.v4()
        });
        const addedUser = await userStorage_1.default.addUser(user);
        if (addedUser) {
            return {
                status: 201,
                header: 'Content-Type: application/json',
                body: JSON.stringify(addedUser),
            };
        }
        else {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: 'ЧТОТО ПОШЛО НЕ ТАК Я ХЗ',
            };
        }
    },
    'deleteUser': async (id) => {
        if (!(0, isUUID_1.isUUID)(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            };
        }
        const isOperationSucced = await userStorage_1.default.deleteUser(id);
        if (!isOperationSucced) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            };
        }
        else {
            return {
                status: 204,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `user with id ${id} removed successfully` }),
            };
        }
    },
};
