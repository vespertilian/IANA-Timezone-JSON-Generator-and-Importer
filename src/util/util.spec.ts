import {
    ensureExistsAsync, ensureExistsFactory,
    readdirAsync,
    readFileAsync,
    removeLineBreaks,
    statAsync,
    unlinkAsync,
    writeFileAsync
} from './util';
import * as path from 'path';
import {promisify} from 'util';

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

    describe('removeLineBreaks', () => {
        it('should remove the linebreaks from a string', () => {
            const stringWithLinebreaks = "Foo \nbar";
            const result = removeLineBreaks(stringWithLinebreaks);
            expect(result).toEqual("Foo bar");
        })
    });

    describe('statAsync', () => {
        it('should return the fs.stat in an async fasion', async() => {
            const dir = path.join(__dirname, './', 'test-dir');
            const stat = await statAsync(dir);
            expect(stat.isDirectory()).toBe(true)
        })
    });

    describe('ensure exists', () => {
        it('should do nothing if a folder exists error is reported', async() => {
            const dir = path.join(__dirname, './', 'test-dir');
            await ensureExistsAsync(dir)
        });

        it('should rethrow valid errors', async() => {
            const dir = path.join(__dirname, './', 'test-dir');
            const fakeFs = {
                mkdir: (path: any, mask: any, cb: any) => {
                    cb('some error') // fake error
                }
            };
            const ensureExistsAsync = promisify(ensureExistsFactory(fakeFs.mkdir as any))

            await ensureExistsAsync(dir)
                .catch(err => {
                    expect(err).toEqual('some error');
                });
        });

        it('should succesfully create a new folder', async() => {
            const dir = path.join(__dirname, './', 'test-dir');
            const fakeFs = {
                mkdir: (path: any, mask: any, cb: any) => {
                    cb(null) // fake error
                }
            };
            const ensureExistsAsync = promisify(ensureExistsFactory(fakeFs.mkdir as any));
            await ensureExistsAsync(dir)
        })
    })
});