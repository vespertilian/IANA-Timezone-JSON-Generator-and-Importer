export interface GeographicAreaMap {
    [geographicArea: string]: {
        geographicAreaDisplayName: string;
        geographicArea: string;
        locationList: LocationListValue[];
    };
}
export interface LocationListValue {
    location: string;
    locationDisplayName: string;
}
export interface GeographicAreaListValue {
    geographicArea: string;
    geographicAreaDisplayName: string;
}
