# crud_api
Simple CRUD API

## Before all
Check if node \> v20.11.0 is installed:
```bush
node -v
```
Install dependencies:
```bush
npm install
```
Change file .env.example:
```bush
.env.example -> .env
```

## API routes
GET all users [api/users] 
```bush
http://localhost:4000/api/users
```

GET user by id [api/users/{id}]
```bush
 http://localhost:4000/api/users/{id}
```

POST, add user [api/users]
```bush
 http://localhost:4000/api/users
```

PUT, update user by id [api/users/{id}]
```bush
 http://localhost:4000/api/users/{id}
```

DELETE, remove user by id [api/users/{id}] 
```bush
http://localhost:4000/api/users/{id}
```

## Test dev mode (simple server)
```bush
npm run start:dev
```
To test server error: 

    - uncomment //test Server Error in file action.ts
    - send GET request

## Test dev mode (multi server)

```bush
npm run start:multi
```

To test if the database the same between servers on different port:

    - uncomment 2 **// тест ------ //** blocks to receive responses directly from servers on their ports
    - send requests (sometimes it takes some time to update databse)
To test server error: 

    - uncomment //test Server Error in file action.ts
    - npm run start:dev
    - send GET request

## Test prod mode

```bush
npm run start:prod
```
```bush
npm run start:multi:prod
```
