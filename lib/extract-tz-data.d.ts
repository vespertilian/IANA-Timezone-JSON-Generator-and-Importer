export interface ICoordinates {
    latitude: {
        sign: string;
        degree: number;
        minute: number;
        second: number | undefined;
    };
    longitude: {
        sign: string;
        degree: number;
        minute: number;
        second: number | undefined;
    };
}
export interface IExtractedTimezoneData {
    countryCode: string;
    coordinates: ICoordinates;
    timezoneName: string;
    comments: string | null;
}
export declare function extractTzData(zoneData: any, zoneFileName: string): {
    zones: IExtractedTimezoneData[];
    numberOfZones: number;
};
