export interface IDecimalLatLong {
    IANAVersion: string
    originalFileName: string
    numberOfZones: number
    zones: IZones[]
}

export interface IZones {
    countryCodes: string[]
    timezone: string
    geographicArea: string
    geographicAreaDisplayName: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

