/// <reference types="node" />
import * as fs from "fs";
export declare const readdirAsync: typeof fs.readdir.__promisify__;
export declare const readFileAsync: typeof fs.readFile.__promisify__;
export declare const writeFileAsync: typeof fs.writeFile.__promisify__;
export declare const unlinkAsync: typeof fs.unlink.__promisify__;
export declare function removeLineBreaks(value: string): string;
