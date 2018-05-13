import {walk} from '../util/walk';
import {extractTzData} from '../extract-tz-data/extract-tz-data';
import {getIANATzData} from '../get-iana-tz-data/get-iana-tz-data';
import {
    createJSONFromHandlebarsTemplates,
    ICreateJSONSettings
} from '../create-json-from-handlebars-templates/create-json-from-handlebars-templates';
import * as path from 'path';

const defaultSettings: ICreateJSONSettings = {
    templatesPath: path.join(__dirname, '..', '..', 'templates'),
    saveDirectory: path.join(__dirname, '..', '..', 'timezones'),
    zoneFileNames: ['zone1970.tab']
};

export async function createJSONFromTemplatesAndZoneData(
    _settings: ICreateJSONSettings = {} as any,
    _getIANATzData=getIANATzData,
    _createJSONFromHandlebarsTemplates=createJSONFromHandlebarsTemplates,
    _extractTzData=extractTzData,
    _walk=walk as any,
) {
    const {zoneFileNames, saveDirectory, templatesPath} = {...defaultSettings, ..._settings};

    const zoneData = await _getIANATzData({filesToExtract: zoneFileNames});
    const handlebarsTemplateFileNames = await _walk(templatesPath).then((allFiles: string[]) => allFiles.filter(isHandleBarsFile));

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

function isHandleBarsFile(filename: string) {
    return filename.includes('.hbs')
}
