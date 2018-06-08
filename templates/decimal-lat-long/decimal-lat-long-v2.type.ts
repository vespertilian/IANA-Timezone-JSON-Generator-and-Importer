export interface IDecimalLatLong {
    IANAVersion: string
    originalFileName: string
    numberOfZones: number
    zones: IZone[]
}

export interface IZone {
    countryCodes: string[]
    timezone: string
    geographicArea: string
    geographicAreaDisplayName: string
    location: string
    locationDisplayName: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

