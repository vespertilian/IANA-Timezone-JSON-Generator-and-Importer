import {FileToBeCreated, IExtractedTimezoneData} from '../../src/types-for-ts-templates';
import {GeographicAreaListValue, GeographicAreaMap} from './group-by-region-with-country-codes.type';

export function createFiles(extractedTimezoneData: IExtractedTimezoneData): FileToBeCreated[] {
    const geographicAreas = extractedTimezoneData.zones.reduce((acc, zone) => {
        const {geographicArea, location, locationDisplayName, geographicAreaDisplayName, countryCodes} = zone;

        if(!acc[geographicArea]) {
            acc[geographicArea] = {
                geographicArea,
                geographicAreaDisplayName,
                locationList: [{location, locationDisplayName, countryCodes}],
            }
        } else {
            const geoArea = acc[geographicArea];
            geoArea.locationList.push({location, locationDisplayName, countryCodes});
        }

        return acc;
    }, {} as GeographicAreaMap);

    const areaList: GeographicAreaListValue[] = Object.keys(geographicAreas)
        .map(areaKey => {
            const {geographicAreaDisplayName, geographicArea} = geographicAreas[areaKey];
            const result = {
                geographicArea,
                geographicAreaDisplayName,
            };
            return result
        })
        .sort(alphabeticGeographicAreaNameSort);

    const files = areaList
        .map(({geographicArea}) => {
        return {
            fileName: geographicArea,
            json: JSON.stringify(geographicAreas[geographicArea])
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


