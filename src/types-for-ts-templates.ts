// these types need to be in the templates folder so that th src folder does not get exported when types are generated for the templates

export interface ICoordinates {
    latitude: {
        negative: boolean,
        sign: string
        degree: number,
        minute: number,
        second: number | null
        decimal: number
    },
    longitude: {
        negative: boolean,
        sign: string
        degree: number,
        minute: number,
        second: number | null
        decimal: number
    }
}

export interface IExtractedTimezone {
    countryCodes: string[],
    coordinates: ICoordinates
    timezoneName: string
    geographicArea: string
    location: string
    comments: string | null
}

export interface IExtractedTimezoneData {
    zones: IExtractedTimezone[]
    numberOfZones: number
    version: string
    originalFileName: string
}

export interface FileToBeCreated {
    fileName: string,
    json: string
}

export type timezoneFileCreator = (extractedTimezoneData: IExtractedTimezoneData) => FileToBeCreated[]

export interface CreationFile {
    createFiles: timezoneFileCreator
}