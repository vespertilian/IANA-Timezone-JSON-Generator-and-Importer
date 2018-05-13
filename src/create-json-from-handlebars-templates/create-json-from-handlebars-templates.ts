import {IExtractedTimezoneData} from '../extract-tz-data/extract-tz-data';
import * as path from 'path';
import * as Handlebars from 'handlebars'
import {ensureExistsAsync, readFileAsync, writeFileAsync} from '../util/util';

export interface ICreateJSONSettings {
    templatesPath: string,
    saveDirectory: string,
    zoneFileNames: string[]
}




export interface ICreateJSONFromHandlebarsTemplatesParams{
    handlebarsTemplateFileNames: string [],
    extractedZoneData: IExtractedTimezoneData,
    templatesPath: string
    zoneFileName: string
    saveDirectory: string
}

export async function createJSONFromHandlebarsTemplates(
    params: ICreateJSONFromHandlebarsTemplatesParams,
    _writeFileAsync=writeFileAsync as any,
    _readFileAsync=readFileAsync as any,
    _ensureExistsAsync=ensureExistsAsync as any,
    _log= console.log
) {
    const {handlebarsTemplateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory} = params;

    for(let filename of handlebarsTemplateFileNames) {
        await createJSONFile(filename)
    }

    async function createJSONFile(filenamePath: string) {
        _log(`Creating JSON for: ${filenamePath} with ${zoneFileName}`);

        const filePath = `${templatesPath}/${filenamePath}`;
        const hbsFile = await _readFileAsync(filePath, 'utf-8');
        const hbsTemplate = Handlebars.compile(hbsFile);

        const output = hbsTemplate(extractedZoneData);

        try {
            // parseJSON to make sure it is valid!
            const parsedJSON = JSON.parse(output);

            // create filename and path
            const endFilePosition = filenamePath.lastIndexOf('/'); //?
            const filename =
                (endFilePosition > 0) ?
                filenamePath.slice(endFilePosition + 1, filenamePath.length) :
                filenamePath;


            const fullPath =
                (endFilePosition > 0) ?
                    `${saveDirectory}/${filenamePath.slice(0, endFilePosition)}`:
                    saveDirectory;

            const filenameSansTab = zoneFileName.replace('.tab', '');
            const writeFileName = `${extractedZoneData.version}-${filenameSansTab}-${filename.replace('.hbs', '.json')}`;
            const writePath = path.join(fullPath, writeFileName);

            // turn json into pretty string and write file,
            // this conversion formats it slightly better than handlebars
            const jsonString = JSON.stringify(parsedJSON, null, 4);
            await _ensureExistsAsync(fullPath);
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


