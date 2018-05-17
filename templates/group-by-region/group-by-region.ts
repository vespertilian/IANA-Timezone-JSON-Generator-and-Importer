import {FileToBeCreated, IExtractedTimezoneData} from '../../src/types-for-ts-templates';

interface GeographicAreaMap {
    [geographicAreaName: string]: {
        geographicAreaName: string;
        locationList: LocationListValue[]
    }
}

interface LocationListValue {
    location: string,
    displayName: string
}

interface GeographicAreaListValue {
    geographicAreaName: string,
    displayName: string
}

export function createFiles(extractedTimezoneData: IExtractedTimezoneData): FileToBeCreated[] {
    const geographicAreas = extractedTimezoneData.zones.reduce((acc, zone) => {

        const {geographicArea, location} = zone;

        const _location = formatLocation(location);

        if(!acc[geographicArea]) {
            acc[geographicArea] = {
                geographicAreaName: geographicArea,
                locationList: [_location],
            }
        } else {
            const geoArea = acc[geographicArea];
            geoArea.locationList.push(_location);
        }

        return acc;
    }, {} as GeographicAreaMap);

    const areaList: GeographicAreaListValue[] = Object.keys(geographicAreas)
        .map(area => {
            switch(area) {
                case 'Indian':
                    return {
                        geographicAreaName: area,
                        displayName: 'Indian Ocean'
                    };
                case 'Atlantic':
                    return {
                        geographicAreaName: area,
                        displayName: 'Atlantic Ocean'
                    };
                case 'Pacific':
                    return {
                        geographicAreaName: area,
                        displayName: 'Pacific Ocean'
                    };
                default:
                    return {
                        geographicAreaName: area,
                        displayName: area
                    }
            }
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

function alphabeticGeographicAreaNameSort(a: GeographicAreaListValue, b: GeographicAreaListValue) {
    const nameA = a.displayName.toUpperCase();
    const nameB = b.displayName.toUpperCase();

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
