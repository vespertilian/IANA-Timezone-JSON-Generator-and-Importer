import {promisify} from "util";
import * as fs from "fs";

export const readdirAsync =  promisify(fs.readdir);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);
export const unlinkAsync = promisify(fs.unlink);
export const statAsync  = promisify(fs.stat);

export function removeLineBreaks(value: string): string {
    return value.replace(/\n/g, '')
}

export function ensureExistsFactory(mkdir = fs.mkdir){
    return function ensureExists(path: any, cb: any) {
        const mask = '0777';
        mkdir(path, mask, function(err) {
            if (err) {
                if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
                else cb(err); // something else went wrong
            } else cb(null); // successfully created folder
        });
    }
}

export const ensureExistsAsync = promisify(ensureExistsFactory());