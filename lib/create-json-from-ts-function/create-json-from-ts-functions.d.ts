import { ICreateJSONFromTemplatesParams } from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';
export declare function createJsonFromTsFunctions(params: ICreateJSONFromTemplatesParams, _writeFileAsync?: any, _ensureExistsAsync?: any, _log?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): Promise<void>;
