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
    countryCode: string;
    coordinates: ICoordinates;
    timezoneName: string;
    comments: string | null;
}
export interface IExtractedTimezoneData {
    zones: IExtractedTimezone[];
    numberOfZones: number;
    version: string;
    originalFileName: string;
}
export declare function extractTzData(zoneData: any, zoneFileName: string): IExtractedTimezoneData;
