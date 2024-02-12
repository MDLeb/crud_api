import { startServer } from "./server";
import dotenv from 'dotenv';
import cluster from 'cluster';
import fs from 'fs';
import path from 'path';
import { cpus } from 'os';
import { startMultiServer } from "./multi_server";
import { UserStorage } from "./userStorage";

dotenv.config();
const PORT = process.env.PORT || 4000;
const isMulti = process.argv.find(i => i.startsWith('--MULTI_SERVER'))?.replace('--MULTI_SERVER=', '') ?? false;
(global as any).UserStorage = new UserStorage();

if(cluster.isPrimary){
    fs.writeFile(path.resolve('./src', 'users.json'), '[]', {}, () => {})
}

isMulti ? startMultiServer() : startServer();


