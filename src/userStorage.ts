import os from 'node:os';
import uuid from 'uuid';

type User = {
    id: string,
    username: string,
    age: number,
    hobbies: string[]
}

class UserStorage {
    #USERS: User[] = [];

    #getUserIndexById = (id: string) => {
        let userIndex = -1;
        this.#USERS.find((u, i) => u.id === id && (userIndex = i));
        return userIndex;
    };

    addUser = (user: User) => this.#USERS.push(user);

    getAllUsers = () => this.#USERS;

    getUserById = (id: string) => this.#USERS.find(u => u.id === id);

    updateUserById = (id: string, userProps: Partial<User>) => {

        let userIndex = this.#getUserIndexById(id);

        if(userIndex >= 0) {
            Object.assign(this.#USERS[userIndex], userProps);
            return this.#USERS[userIndex];
        } else {
            return false;
        }
    }


}

export default new UserStorage();

