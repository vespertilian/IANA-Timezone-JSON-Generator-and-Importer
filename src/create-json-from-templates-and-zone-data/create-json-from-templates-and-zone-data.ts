import {walk} from '../util/walk';
import {extractTzData} from '../extract-tz-data/extract-tz-data';
import {getIANATzData} from '../get-iana-tz-data/get-iana-tz-data';
import {
    createJSONFromHandlebarsTemplates,
    ICreateJSONSettings
} from '../create-json-from-handlebars-templates/create-json-from-handlebars-templates';
import * as path from 'path';
import {IExtractedTimezoneData} from '../types-for-ts-templates';
import {createJsonFromTsFunctions} from '../create-json-from-ts-function/create-json-from-ts-functions';

const defaultSettings: ICreateJSONSettings = {
    templatesPath: path.join(__dirname, '..', '..', 'templates'),
    saveDirectory: path.join(__dirname, '..', '..', 'timezones'),
    zoneFileNames: ['zone1970.tab']
};


export interface ICreateJSONFromTemplatesParams{
    templateFileNames: string [],
    extractedZoneData: IExtractedTimezoneData,
    templatesPath: string
    zoneFileName: string
    saveDirectory: string
}

export async function createJSONFromTemplatesAndZoneData(
    _settings: ICreateJSONSettings = {} as any,
    _getIANATzData=getIANATzData,
    _createJSONFromHandlebarsTemplates=createJSONFromHandlebarsTemplates,
    _extractTzData=extractTzData,
    _walk=walk as any,
    _createJSONFromTsFunctions = createJsonFromTsFunctions,
) {
    const {zoneFileNames, saveDirectory, templatesPath} = {...defaultSettings, ..._settings};

    const zoneData = await _getIANATzData({filesToExtract: zoneFileNames});
    const allFiles = await _walk(templatesPath);
    const handlebarsTemplateFileNames = allFiles.filter(isHandleBarsFile);
    const typescriptFiles = allFiles.filter(isTypescriptFile);

    zoneFileNames.forEach(async(zoneFileName) => {
        const extractedZoneData = await _extractTzData(zoneData, zoneFileName);

        await _createJSONFromHandlebarsTemplates({
            templateFileNames: handlebarsTemplateFileNames,
            extractedZoneData,
            templatesPath,
            zoneFileName,
            saveDirectory
        });

        // TODO test
        await _createJSONFromTsFunctions({
            templateFileNames: typescriptFiles,
            extractedZoneData,
            templatesPath,
            zoneFileName,
            saveDirectory
        })
    })
}

function isHandleBarsFile(filename: string) {
    return filename.includes('.hbs')
}

function isTypescriptFile(filename: string) {
    // do not include type files
    return filename.includes('.ts') && !filename.includes('.type')
}
