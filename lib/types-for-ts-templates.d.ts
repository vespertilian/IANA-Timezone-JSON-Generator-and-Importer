export interface ICoordinates {
    latitude: {
        negative: boolean;
        sign: string;
        degree: number;
        minute: number;
        second: number | null;
        decimal: number;
    };
    longitude: {
        negative: boolean;
        sign: string;
        degree: number;
        minute: number;
        second: number | null;
        decimal: number;
    };
}
export interface IExtractedTimezone {
    countryCodes: string[];
    coordinates: ICoordinates;
    timezoneName: string;
    geographicArea: string;
    geographicAreaDisplayName: string;
    location: string;
    locationDisplayName: string;
    comments: string | null;
}
export interface IExtractedTimezoneData {
    zones: IExtractedTimezone[];
    numberOfZones: number;
    version: string;
    originalFileName: string;
}
export interface FileToBeCreated {
    fileName: string;
    json: string;
}
export declare type timezoneFileCreator = (extractedTimezoneData: IExtractedTimezoneData) => FileToBeCreated[];
export interface CreationFile {
    createFiles: timezoneFileCreator;
}
