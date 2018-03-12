import fetch from 'node-fetch';
export interface getIANATzDataParams {
    url?: string;
    filesToExtract?: string[];
    fileEncoding?: string;
}
export interface IANATzDataFiles {
    version: string;
    [key: string]: string;
}
export declare function getIANATzData(params?: getIANATzDataParams, _fetch?: typeof fetch): Promise<IANATzDataFiles>;
