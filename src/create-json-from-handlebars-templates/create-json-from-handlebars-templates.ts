import {getIANATzData} from '../get-iana-tz-data/get-iana-tz-data';
import {extractTzData, IExtractedTimezoneData} from '../extract-tz-data/extract-tz-data';
import * as path from 'path';
import * as Handlebars from 'handlebars'
import {readdirAsync, readFileAsync, writeFileAsync} from '../util/util';

export interface ICreateJSONSettings {
    templatesPath: string,
    saveDirectory: string,
    zoneFileNames: string[]
}

const defaultSettings: ICreateJSONSettings = {
    templatesPath: path.join(__dirname, '..', '..', 'templates'),
    saveDirectory: path.join(__dirname, '..', '..', 'timezones'),
    zoneFileNames: ['zone1970.tab', 'zone.tab']
};

export async function createJSONFromHandlebarsTemplatesAndZoneData(
    _settings: ICreateJSONSettings = {} as any,
    _getIANATzData=getIANATzData,
    _createJSONFromHandlebarsTemplates=createJSONFromHandlebarsTemplates,
    _extractTzData=extractTzData,
    _readdirAsync=readdirAsync as any,
) {
    const {zoneFileNames, saveDirectory, templatesPath} = {...defaultSettings, ..._settings};

    const zoneData = await _getIANATzData({filesToExtract: zoneFileNames});
    const handlebarsTemplateFileNames = await _readdirAsync(templatesPath).then((allFiles: string[]) => allFiles.filter(isHandleBarsFile));

    zoneFileNames.forEach(async(zoneFileName) => {
        const extractedZoneData = await _extractTzData(zoneData, zoneFileName);
        await _createJSONFromHandlebarsTemplates({
            handlebarsTemplateFileNames,
            extractedZoneData,
            templatesPath,
            zoneFileName,
            saveDirectory
        });
    })
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
    _log= console.log
) {
    const {handlebarsTemplateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory} = params;

    for(let filename of handlebarsTemplateFileNames) {
        await createJSONFile(filename)
    }

    async function createJSONFile(filename: string) {
        _log(`Creating JSON for: ${filename} with ${zoneFileName}`);

        const filePath = `${templatesPath}/${filename}`;
        const hbsFile = await _readFileAsync(filePath, 'utf-8');
        const hbsTemplate = Handlebars.compile(hbsFile);

        const output = hbsTemplate(extractedZoneData);

        try {
            // parseJSON to make sure it is valid!
            const parsedJSON = JSON.parse(output);

            // create filename and path
            const filenameSansTab = zoneFileName.replace('.tab', '');
            const writeFileName = `${extractedZoneData.version}-${filenameSansTab}-${filename.replace('.hbs', '.json')}`;
            const writePath = path.join(saveDirectory, writeFileName);

            // turn json into pretty string and write file,
            // this conversion formats it slightly better than handlebars
            const jsonString = JSON.stringify(parsedJSON, null, 4);
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

function isHandleBarsFile(filename: string) {
    return filename.includes('.hbs')
}

