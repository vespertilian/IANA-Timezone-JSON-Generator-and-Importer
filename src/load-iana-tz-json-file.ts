import {readdirAsync, readFileAsync} from './util/util';
import * as path from 'path';

export async function loadIANATzJsonFile(filename: string) {
    const timezonesPath = path.join(__dirname, '..', 'timezones');
    const files: string[] = await readdirAsync(timezonesPath);

    if(!files.includes(filename)) {
        throw new Error(`
            File does not exist
            Options: ${files}
        `)
    }

    const filePath = path.join(__dirname, '..', 'timezones', filename);
    const file = await readFileAsync(filePath);
    return file.toString();
}
