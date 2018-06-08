import { extractTzData } from '../extract-tz-data/extract-tz-data';
import { getIANATzData } from '../get-iana-tz-data/get-iana-tz-data';
import { createJSONFromHandlebarsTemplates, ICreateJSONSettings } from '../create-json-from-handlebars-templates/create-json-from-handlebars-templates';
import { IExtractedTimezoneData } from '../types-for-ts-templates';
import { createJsonFromTsFunctions } from '../create-json-from-ts-function/create-json-from-ts-functions';
export interface ICreateJSONFromTemplatesParams {
    templateFileNames: string[];
    extractedZoneData: IExtractedTimezoneData;
    templatesPath: string;
    zoneFileName: string;
    saveDirectory: string;
}
export declare function createJSONFromTemplatesAndZoneData(_settings?: ICreateJSONSettings, _getIANATzData?: typeof getIANATzData, _createJSONFromHandlebarsTemplates?: typeof createJSONFromHandlebarsTemplates, _createJSONFromTsFunctions?: typeof createJsonFromTsFunctions, _extractTzData?: typeof extractTzData, _walk?: any): Promise<void>;
