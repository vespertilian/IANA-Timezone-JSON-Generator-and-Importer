export interface IAllFields {
    IANAVersion: string;
    numberOfZones: number;
    zones: IZones[];
}
export interface IZones {
    countryCode: string;
    timezone: string;
    coordinates: {
        latitude: ICoordinate;
        longitude: ICoordinate;
    };
}
export interface ICoordinate {
    sign: string;
    degree: number;
    minute: number;
    second?: number;
}
