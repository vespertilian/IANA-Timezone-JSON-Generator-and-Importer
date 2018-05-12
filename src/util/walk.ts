import {readdirAsync, statAsync} from './util';
import * as path from 'path';

export async function walk(dir: string) {
    let files: string[] = [];
    const values =  await readdirAsync(dir);
    for(let value of values) {
        const fileOrDir = path.resolve(dir, value);
        const stat = await statAsync(fileOrDir);

       if(stat.isDirectory()) {
           const newDir = fileOrDir;
           const subdirectoryFiles = await walk(newDir);
           const filesWithDirectory = subdirectoryFiles.map(fileName => `${value}/${fileName}`);
           files = files.concat(filesWithDirectory);
       } else {
           files.push(value);
       }
    }
    return files;
}