import { getIANATzData } from '../get-iana-tz-data/get-iana-tz-data';
import { extractTzData, IExtractedTimezoneData } from '../extract-tz-data/extract-tz-data';
export interface ICreateJSONSettings {
    templatesPath: string;
    saveDirectory: string;
    zoneFileNames: string[];
}
export declare function createJSONFromHandlebarsTemplatesAndZoneData(_settings?: ICreateJSONSettings, _getIANATzData?: typeof getIANATzData, _createJSONFromHandlebarsTemplates?: typeof createJSONFromHandlebarsTemplates, _extractTzData?: typeof extractTzData, _readdirAsync?: any): Promise<void>;
export interface ICreateJSONFromHandlebarsTemplatesParams {
    handlebarsTemplateFileNames: string[];
    extractedZoneData: IExtractedTimezoneData;
    templatesPath: string;
    zoneFileName: string;
    saveDirectory: string;
}
export declare function createJSONFromHandlebarsTemplates(params: ICreateJSONFromHandlebarsTemplatesParams, _writeFileAsync?: any, _readFileAsync?: any, _log?: {
    (message?: any, ...optionalParams: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): Promise<void>;
