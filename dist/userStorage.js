"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStorage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class UserStorage {
    #USERS = [];
    #getUsersFromFile = async () => {
        let users = await promises_1.default.readFile(path_1.default.resolve('./src', 'users.json'), { encoding: 'utf-8' });
        this.#USERS = JSON.parse(users);
    };
    #updateFile = async () => {
        await promises_1.default.writeFile(path_1.default.resolve('./src', 'users.json'), JSON.stringify(this.#USERS));
    };
    addUser = async (user) => {
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
        return this.#USERS;
    };
    getUserById = async (id) => {
        await this.#getUsersFromFile();
        return this.#USERS.find(u => u.id === id);
    };
    updateUserById = async (id, userProps) => {
        await this.#getUsersFromFile();
        let userIndex = this.#USERS.findIndex(u => u.id === id);
        if (userIndex >= 0) {
            Object.assign(this.#USERS[userIndex], JSON.parse(userProps));
            await this.#updateFile();
            return this.#USERS[userIndex];
        }
        else {
            return false;
        }
    };
    deleteUser = async (id) => {
        await this.#getUsersFromFile();
        let userIndex = this.#USERS.findIndex(u => u.id === id);
        console.log('63', userIndex);
        if (userIndex >= 0) {
            this.#USERS.splice(userIndex, 1);
            await this.#updateFile();
            return true;
        }
        else {
            return false;
        }
    };
}
exports.UserStorage = UserStorage;
exports.default = new UserStorage();
