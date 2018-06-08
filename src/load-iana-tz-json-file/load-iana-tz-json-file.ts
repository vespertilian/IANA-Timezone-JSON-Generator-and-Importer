import {readFileAsync} from '../util/util';
import * as path from 'path';
import {walk} from '../util/walk';

export async function loadIANATzJsonFile(filename: string) {
    const timezonesPath = path.join(__dirname, '../..', 'timezones');
    const files: string[] = await walk(timezonesPath);

    if(!files.includes(filename)) {
        throw new Error(`
            File does not exist
            Options: ${files}
        `)
    }

    const filePath = path.join(timezonesPath, filename);
    const file = await readFileAsync(filePath);
    return file.toString();
}
