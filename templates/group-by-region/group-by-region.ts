import {FileToBeCreated, IExtractedTimezoneData} from '../../src/types-for-ts-templates';

interface GeographicAreaMap {
    [geographicAreaName: string]: {
        geographicAreaName: string;
        locationList: string[]
        locationMap: {
            [location: string]: string
        }
    }
}

export function createFiles(extractedTimezoneData: IExtractedTimezoneData): FileToBeCreated[] {
    const geographicAreas = extractedTimezoneData.zones.reduce((acc, zone) => {

        const {geographicArea, location, timezoneName} = zone;

        if(!acc[geographicArea]) {
            acc[geographicArea] = {
                geographicAreaName: geographicArea,
                locationList: [location],
                locationMap: {
                    [location]: timezoneName
                },
            }
        } else {
            const geoArea = acc[geographicArea];
            geoArea.locationList.push(location);
            const newLocation = {
                [location]: timezoneName
            };
            geoArea.locationMap = {...geoArea.locationMap, ...newLocation}
        }

        return acc;
    }, {} as GeographicAreaMap);

    const areaList = Object.keys(geographicAreas)
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
        });

    const files = areaList.map(({geographicAreaName}) => {
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