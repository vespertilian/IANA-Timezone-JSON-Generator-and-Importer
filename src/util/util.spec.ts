import {readdirAsync} from './util';
import * as path from 'path';

describe('util', () => {
    describe('readdirAsync', () => {
        it('should wrap fs.readdir and allow awaiting', async() => {
            const dir = await readdirAsync(path.join(__dirname));
            expect(dir.includes('util.spec.ts')).toBe(true);
        })
    })

});