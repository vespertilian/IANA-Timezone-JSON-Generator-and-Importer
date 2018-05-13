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

    const areaList = Object.keys(geographicAreas);
    const files = areaList.map(key => {
        return {
            fileName: key,
            json: JSON.stringify(geographicAreas[key])
        }
    });
    files.push({
        fileName: 'geographic-area-map',
        json: JSON.stringify(areaList)
    });
    return files;
}