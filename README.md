# crud_api
Simple CRUD API

## Before all
```bush
node -v
```
\> v20.11.0
```bush
npm install
```

## API routes
```bush
npm run start:dev
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
start:multi:prod
```