import {walk} from './walk';
import * as path from "path";

describe('walk', () => {
    it('should read files from directories and subdirectories', async()=> {
        const dir = path.join(__dirname, './', 'test-dir');
        const result = await walk(dir);

        const expectedResult = ['file-a.hbs', 'test-dir-1/file-b.hbs'];

        expect(result).toEqual(expectedResult);
    })
});
