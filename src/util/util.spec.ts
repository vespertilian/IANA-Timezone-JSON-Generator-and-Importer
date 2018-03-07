import {readdirAsync, readFileAsync, replaceLineBreaks, unlinkAsync, writeFileAsync} from './util';
import * as path from 'path';

describe('util', () => {
    describe('readdirAsync', () => {
        it('should wrap fs.readdir and allow awaiting', async() => {
            const dir = await readdirAsync(path.join(__dirname));  //?
            expect(dir.includes('util.spec.ts')).toBe(true);
        })
    });

    describe('readFileAsync', () => {
       it('should wrap fs.fileread and allow awaiting', async() => {
           const filePath = path.join(__dirname, 'util.ts'); //?
           const file = await readFileAsync(filePath);
           expect(file.toString().includes('import * as fs from "fs"')).toBe(true);
       })
    });

    describe('writeFileAsync and unlinkAsync', () => {
        it('should wrap fs.writeFileAsync and allow awaiting', async() => {
            // write file
            const filePath = path.join(__dirname, 'testfile.txt');
            await writeFileAsync(filePath, 'some test file text');

            // check file exists
            const dir = await readdirAsync(path.join(__dirname));
            expect(dir.includes('testfile.txt')).toBe(true);

            // added unlink to cleanup
            await unlinkAsync(filePath);
            const cleanDir = await readdirAsync(path.join(__dirname));
            expect(cleanDir.includes('testfile.txt')).toBe(false);
        })
    });

    describe('replaceLineBreaks', () => {
        it('should remove the linebreaks from a string', () => {
            const stringWithLinebreaks = "Foo \nbar";
            const result = replaceLineBreaks(stringWithLinebreaks);
            expect(result).toEqual("Foo bar");
        })
    })
});