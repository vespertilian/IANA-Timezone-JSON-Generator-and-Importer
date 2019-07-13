/// <reference types="node" />
import * as fs from "fs";
export declare const readdirAsync: typeof fs.readdir.__promisify__;
export declare const readFileAsync: typeof fs.readFile.__promisify__;
export declare const writeFileAsync: typeof fs.writeFile.__promisify__;
export declare const unlinkAsync: typeof fs.unlink.__promisify__;
export declare const statAsync: typeof fs.stat.__promisify__;
export declare function removeLineBreaks(value: string): string;
export declare function ensureExistsFactory(mkdir?: typeof fs.mkdir): (path: any, cb: any) => void;
export declare const ensureExistsAsync: (arg1: any) => Promise<unknown>;
