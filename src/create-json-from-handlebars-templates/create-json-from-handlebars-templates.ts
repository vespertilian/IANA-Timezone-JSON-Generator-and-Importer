import * as path from 'path';
import * as Handlebars from 'handlebars'
import {ensureExistsAsync, readFileAsync, writeFileAsync} from '../util/util';
import {ICreateJSONFromTemplatesParams} from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';

export interface ICreateJSONSettings {
    templatesPath: string,
    saveDirectory: string,
    zoneFileNames: string[]
}

export async function createJSONFromHandlebarsTemplates(
    params: ICreateJSONFromTemplatesParams,
    _writeFileAsync=writeFileAsync as any,
    _readFileAsync=readFileAsync as any,
    _ensureExistsAsync=ensureExistsAsync as any,
    _log= console.log
) {
    const {templateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory} = params;

    for(let filenamePath of templateFileNames) {
        // includes the file sub-directories and filename
        // i.e test-dir/aaa.hbs
        await createJSONFile(filenamePath)
    }

    async function createJSONFile(filenamePath: string) {
        _log(`Creating JSON for: ${filenamePath} with ${zoneFileName}`);

        const filePath = `${templatesPath}/${filenamePath}`;
        const hbsFile = await _readFileAsync(filePath, 'utf-8');
        const hbsTemplate = Handlebars.compile(hbsFile);

        const output = hbsTemplate(extractedZoneData);

        const endFilePosition = filenamePath.lastIndexOf('/');

        // i.e aaa.hbs
        const endFileName =
            (endFilePosition > 0) ?
                filenamePath.slice(endFilePosition + 1, filenamePath.length) :
                filenamePath;

        // i.e saveDirFoo/test-dir
        const savePath =
            (endFilePosition > 0) ?
                `${saveDirectory}/${filenamePath.slice(0, endFilePosition)}`:
                saveDirectory;

        try {
            // parseJSON to make sure it is valid!
            const parsedJSON = JSON.parse(output);

            // create filename and path
            const zoneFilenameSansTab = zoneFileName.replace('.tab', '');
            const writeFileName = `${extractedZoneData.version}-${zoneFilenameSansTab}-${endFileName.replace('.hbs', '.json')}`;
            const writePath = path.join(savePath, writeFileName);

            // turn json into pretty string and write file,
            // this conversion formats it slightly better than handlebars
            const jsonString = JSON.stringify(parsedJSON, null, 4);
            await _ensureExistsAsync(savePath);
            await _writeFileAsync(writePath, jsonString);
        } catch(e) {
            const errorPath = path.join(saveDirectory, 'error.txt');

            try {
                await _writeFileAsync(errorPath, output);
            } catch(e) {
                throw new Error(`
                Could not write error file: ${e}
                Trying to write to path: ${errorPath}
               `)
            }

            throw new Error(`
                Could not parse JSON please check your templates.
                See timezones/error.txt 
                Error: ${e}
            `)
        }
    }
}


