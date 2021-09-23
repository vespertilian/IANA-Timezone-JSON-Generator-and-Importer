/// <reference types="node" />
export interface getIANATzDataParams {
    url?: string;
    filesToExtract?: string[];
    fileEncoding?: BufferEncoding;
}
export interface IANATzDataFiles {
    version: string;
    [key: string]: string;
}
export declare function getIANATzData(params?: getIANATzDataParams, _fetch?: any): Promise<IANATzDataFiles>;
