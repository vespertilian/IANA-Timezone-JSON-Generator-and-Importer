import { ICreateJSONFromTemplatesParams } from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';
export interface ICreateJSONSettings {
    templatesPath: string;
    saveDirectory: string;
    zoneFileNames: string[];
}
export declare function createJSONFromHandlebarsTemplates(params: ICreateJSONFromTemplatesParams, _writeFileAsync?: any, _readFileAsync?: any, _ensureExistsAsync?: any, _log?: {
    (message?: any, ...optionalParams: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): Promise<void>;
