import { getIANATzData } from '../get-iana-tz-data/get-iana-tz-data';
import { IExtractedTimezoneData } from '../extract-tz-data/extract-tz-data';
export interface ICreateJSONSettings {
    templatesPath: string;
    saveDirectory: string;
    zoneFileNames: string[];
}
export declare function createJSONFromHandlebarsTemplatesAndZoneData(_settings?: ICreateJSONSettings, _getIANATzData?: typeof getIANATzData, _createJSONFromHandlebarsTemplates?: typeof createJSONFromHandlebarsTemplates, _readdirAsync?: any): Promise<void>;
export declare function createJSONFromHandlebarsTemplates(files: string[], extractedZoneData: IExtractedTimezoneData, templatesPath: string, zoneFileName: string, saveDirectory: string): Promise<void>;
