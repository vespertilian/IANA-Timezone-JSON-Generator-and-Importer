import {promisify} from "util";
import * as fs from "fs";

export const readdirAsync =  promisify(fs.readdir);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);

export function replaceLineBreaks(value: string): string {
    return value.replace(/\n/g, '')
}
