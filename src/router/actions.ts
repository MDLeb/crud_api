import userStorage from '../userStorage';

export const ACTIONS: { [fn: string]: Function } = {
    'getAllUsers': () => userStorage.getAllUsers(),
    'getUserById': (id: any) => {
        //add validation here
        userStorage.getUserById(id)
    },
    'updateUserById': (id: any, userProps: any) => {
        //add validation here
        userStorage.updateUserById(id, userProps)
    },
    'addUser': (user: any) => {
        //add validation here
        userStorage.addUser(user)
    },
    'deleteUser': (id: any,) => {
        //add validation here
        userStorage.deleteUser(id)
    },
};
