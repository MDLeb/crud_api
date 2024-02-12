import { startServer } from "./server";
import dotenv from 'dotenv';
import cluster from 'cluster';
import fs from 'fs';
import path from 'path';
import { startMultiServer } from "./multi_server";

dotenv.config();
const PORT = process.env.PORT || 4000;
const isMulti = process.argv.find(i => i.startsWith('--MULTI_SERVER'))?.replace('--MULTI_SERVER=', '') ?? false;

if(cluster.isPrimary){
    fs.writeFile(path.resolve('./src/storage', 'users.json'), '[]', {}, () => {})
    //fix me remove file after process exit
}

isMulti ? startMultiServer() : startServer();


