export interface IAllFields {
    IANAVersion: string
    originalFileName: string
    numberOfZones: number
    zones: IZone[]
}

export interface IZone {
    countryCodes: string[]
    timezoneName: string
    geographicArea: string
    geographicAreaDisplayName: string
    location: string
    locationDisplayName: string
    coordinates: {
        latitude: ICoordinate
        longitude: ICoordinate
    }
    comments: string | null
}

export interface ICoordinate {
    sign: string
    degree: number
    minute: number
    second: number | null
}
