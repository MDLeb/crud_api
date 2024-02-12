import { startServer } from '../server';
import http from 'http';
import { router } from '../router/router';
import fs from 'fs';
import path from 'path';

describe('check server', () => {

    beforeAll(() => {
        fs.writeFile(path.resolve('./src/storage', 'users.json'), '[]', {}, () => { })
    })
    beforeAll(() => {
        fs.writeFile(path.resolve('./src/storage', 'users.json'), '[]', {}, () => { })
    })

    let testUID: string;
    const testUser = {
        "username": "test",
        "age": 10,
        "hobbies": ["hobby1", "hobby2"]
    };

    test('get all records with a GET api/users, should return an empty array', async () => {
        const response = await router('/api/users', 'GET', null);
        const body = response.body;
        expect(body).toBe("[]")
    });
    test('create a new object with a POST api/users, should return newly created record', async () => {
        const response = await router('/api/users', 'POST', JSON.stringify(testUser));
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty("id");
        expect(body.id).toBeTruthy();
        testUID = body.id;
        delete body.id;
        expect(body).toEqual(testUser);
    });
    test('get users record by ID with a GET api/user/{userId}, should return a record', async () => {
        const response = await router(`/api/users/${testUID}`, 'GET', null);
        const body = JSON.parse(response.body);
        expect(body.id).toBe(testUID);
        delete body.id;
        expect(body).toEqual(testUser);
    });
    test('update the created record with a PUT api/user/{userId}, should return an updated record', async () => {
        testUser.username = "changed_name";
        const response = await router(`/api/users/${testUID}`, 'PUT', JSON.stringify(testUser));
        const body = JSON.parse(response.body);
        expect(body.id).toBe(testUID);
        expect(body.username).toBe("changed_name");
        delete body.id;
        expect(body).toEqual(testUser);
    });
    test('update the created record with a DELETE api/user/{userId}, should return an updated record', async () => {
        const response = await router(`/api/users/${testUID}`, 'DELETE', null);
        const status = response.status;
        expect(status).toBe(204);
    });
});

