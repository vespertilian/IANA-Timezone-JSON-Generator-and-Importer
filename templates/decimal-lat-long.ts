export interface IAllFields {
    IANAVersion: string
    originalFileName: string
    numberOfZones: number
    zones: IZones[]
}

export interface IZones {
    countryCode: string
    timezone: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

