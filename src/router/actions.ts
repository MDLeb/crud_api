import userStorage from '../userStorage';
import * as uuid from 'uuid';

import { User } from '../types';
import { isUUID } from '../utils/isUUID';
import { isArray } from '../utils/isArray';
import { isNumber } from '../utils/isNumber';
import { isString } from '../utils/isString';



export const ACTIONS: { [fn: string]: Function } = {
    'getAllUsers': () => {
        const users = userStorage.getAllUsers();
        return {
            status: 400,
            header: 'Content-Type: application/json',
            body: JSON.stringify(users),
        }
    },
    'getUserById': (id: any) => {
        if (!isUUID(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            }
        }
        const user = userStorage.getUserById(id as string);
        if (!user) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            }
        } else {
            return {
                status: 200,
                header: 'Content-Type: application/json',
                body: JSON.stringify(user),
            }
        }
    },
    'updateUserById': (id: any, userProps: any) => {
        if (!isUUID(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            }
        }
        const userKeys = Object.keys(userProps) as Array<keyof User>;

        for (let key in userProps) {
            if (!userKeys.includes(key as keyof User)) {
                return {
                    status: 400,
                    header: 'Content-Type: application/json',
                    body: JSON.stringify({ message: 'request body fields do not match to type User' }),
                }
            }
        }
        if (!isString(userProps.name) || !isNumber(userProps.age) || !!isArray(userProps.hobbies)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            }
        }

        const isOperationSucced: boolean | User = userStorage.updateUserById(id as string, userProps as Partial<User>)
        if (!isOperationSucced) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            }
        } else {
            return {
                status: 204,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `user with id ${id} removed successfully` }),
            }
        }
    },
    'addUser': (user: any) => {
        user = JSON.parse(user);
        
        if (!user.username || !user.age || !user.hobbies) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body does not contain required fields' }),
            }
        }
        if (!isString(user.username) || !isNumber(user.age) || !isArray(user.hobbies)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            }
        };
        Object.assign(user, {
            id: uuid.v4()
        })
        const addedUser: User = userStorage.addUser(user as User);
        if (addedUser) {
            return {
                status: 201,
                header: 'Content-Type: application/json',
                body: JSON.stringify(addedUser),
            }
        } else {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: 'ЧТОТО ПОШЛО НЕ ТАК Я ХЗ',
            }
        }
    },
    'deleteUser': (id: any,) => {
        if (!isUUID(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            }
        }
        const isOperationSucced = userStorage.deleteUser(id as string)
        if (!isOperationSucced) {
            return {
                status: 404,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `record with id ${id} doesn't exist` }),
            }
        } else {
            return {
                status: 204,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: `user with id ${id} removed successfully` }),
            }
        }
    },
};

