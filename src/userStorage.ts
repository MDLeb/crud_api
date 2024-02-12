import { User } from './types';
import fs from 'fs/promises';
import path from 'path';

export class UserStorage {

    #USERS: any[] = [];

    #getUsersFromFile = async () => {
        let users = await fs.readFile(path.resolve('./src', 'users.json'), { encoding: 'utf-8' });
        this.#USERS = JSON.parse(users);
    };
    #updateFile = async () => {
        await fs.writeFile(path.resolve('./src', 'users.json'), JSON.stringify(this.#USERS))
    };

    addUser = async (user: User) => {
        console.log('11111', user);
        await this.#getUsersFromFile();
        console.log('2222', this.#USERS);
        this.#USERS.push(user);
        console.log('3333', this.#USERS);
        await this.#updateFile();

        return user;
    };

    getAllUsers = async () => {
        await this.#getUsersFromFile();
        return this.#USERS
    };
    getUserById = async (id: string) => {
        await this.#getUsersFromFile();
        return this.#USERS.find(u => u.id === id)
    };


    updateUserById = async (id: string, userProps: Partial<User>) => {
        await this.#getUsersFromFile();
        let userIndex = this.#USERS.findIndex(u => u.id === id);

        if (userIndex >= 0) {
            Object.assign(this.#USERS[userIndex], JSON.parse(userProps as string));
            await this.#updateFile();
            return this.#USERS[userIndex];
        } else {
            return false;
        }
    }

    deleteUser = async (id: string) => {
        await this.#getUsersFromFile();
        let userIndex = this.#USERS.findIndex(u => u.id === id);
        console.log('63', userIndex);

        if (userIndex >= 0) {
            this.#USERS.splice(userIndex, 1);
            await this.#updateFile();
            return true;
        } else {
            return false;
        }
    }
}
export default new UserStorage();

