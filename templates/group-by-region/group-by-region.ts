import {FileToBeCreated, IExtractedTimezoneData} from '../../src/types-for-ts-templates';

interface GeographicAreaMap {
    [geographicAreaName: string]: {
        geographicAreaDisplayName: string,
        geographicAreaName: string;
        locationList: LocationListValue[]
    }
}

interface LocationListValue {
    location: string,
    displayName: string
}

export interface GeographicAreaListValue {
    geographicAreaName: string,
    geographicAreaDisplayName: string
}

export function createFiles(extractedTimezoneData: IExtractedTimezoneData): FileToBeCreated[] {
    const geographicAreas = extractedTimezoneData.zones.reduce((acc, zone) => {
        const {geographicArea, location, geographicAreaDisplayName} = zone;

        const _location = formatLocation(location);

        if(!acc[geographicArea]) {
            acc[geographicArea] = {
                geographicAreaName: geographicArea,
                geographicAreaDisplayName,
                locationList: [_location],
            }
        } else {
            const geoArea = acc[geographicArea];
            geoArea.locationList.push(_location);
        }

        return acc;
    }, {} as GeographicAreaMap);

    const areaList: GeographicAreaListValue[] = Object.keys(geographicAreas)
        .map(areaKey => {
            const {geographicAreaDisplayName, geographicAreaName} = geographicAreas[areaKey];
            const result = {
                geographicAreaName,
                geographicAreaDisplayName
            };
            return result
        })
        .sort(alphabeticGeographicAreaNameSort);

    const files = areaList
        .map(({geographicAreaName}) => {
        return {
            fileName: geographicAreaName,
            json: JSON.stringify(geographicAreas[geographicAreaName])
        }
    });

    files.push({
        fileName: 'geographic-area-list',
        json: JSON.stringify(areaList)
    });

    return files;
}

export function alphabeticGeographicAreaNameSort(a: GeographicAreaListValue, b: GeographicAreaListValue) {
    const nameA = a.geographicAreaDisplayName.toUpperCase();
    const nameB = b.geographicAreaDisplayName.toUpperCase();

    if(nameA < nameB) {
        return -1;
    }

    if(nameA > nameB) {
        return 1;
    }
    return 0;
}

export function formatLocation(location: string) {
    const displayName = location
        .replace('/', ' - ')
        .replace('_', ' ');
    return {location, displayName}
}
