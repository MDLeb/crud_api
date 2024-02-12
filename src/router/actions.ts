import * as uuid from 'uuid';
import userStorage from '../storage/userStorage';
import { User } from '../types';
import { isUUID } from '../utils/isUUID';
import { isNumber } from '../utils/isNumber';
import { isString } from '../utils/isString';
import { isArrayOfStrings } from '../utils/isArrayOfStrings';


export const ACTIONS: { [fn: string]: Function } = {
    'getAllUsers': async () => {
        const users = await userStorage.getAllUsers();
        return {
            status: 200,
            header: 'Content-Type: application/json',
            body: JSON.stringify(users),
        }
    },
    'getUserById': async (id: any) => {
        if (!isUUID(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            }
        }

        const user = await userStorage.getUserById(id as string);
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
    'updateUserById': async (id: any, userProps: any) => {
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
        if ((userProps.name && !isString(userProps.name)) || 
            (userProps.age && !isNumber(userProps.age)) || 
            (userProps.hobbies && !isArrayOfStrings(userProps.hobbies))) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            }
        }

        const user: boolean | User = await userStorage.updateUserById(id as string, userProps as Partial<User>)
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
    'addUser': async (user: any) => {
        try {
            user = JSON.parse(user);
        }
        catch {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'wrong request' }),
            }
        }

        if (!("username" in user) || !("age" in user) || !("hobbies" in user)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body does not contain required fields' }),
            }
        }
        if (!isString(user.username) || !isNumber(user.age) || !isArrayOfStrings(user.hobbies)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'request body fields do not match types' }),
            }
        };
        Object.assign(user, {
            id: uuid.v4()
        })
        const addedUser: User = await userStorage.addUser(user as User);
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
    'deleteUser': async (id: any,) => {
        if (!isUUID(id)) {
            return {
                status: 400,
                header: 'Content-Type: application/json',
                body: JSON.stringify({ message: 'id is invalid (not uuid)' }),
            }
        }
        const isOperationSucced = await userStorage.deleteUser(id as string)
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

