//@ts-ignore
import * as CSV from 'csv-string';
//@ts-ignore
import * as parseTzdataCoordinate from 'parse-tzdata-coordinate';

export interface ICoordinates {
    latitude: {
        sign: string
        degree: number,
        minute: number,
        second: number | undefined
    },
    longitude: {
        sign: string
        degree: number,
        minute: number,
        second: number | undefined
    }
}

export interface IExtractedTimezoneData {
    countryCode: string,
    coordinates: ICoordinates
    timezoneName: string
    comments: string | null
}

export function extractTzData(zoneData: any, zoneFileName: string): {zones: IExtractedTimezoneData[], numberOfZones: number} {
    const separator = '\t';
    const parsedCSV: string[][] = CSV.parse(zoneData[zoneFileName], separator);

    const filteredZoneData = parsedCSV.filter(isValidZoneTabRow);

    const zones = filteredZoneData
        .map(zoneData => {
            const [countryCode , coordinates, timezoneName, comments] = zoneData;
            return {
                countryCode: countryCode,
                coordinates: parseTzdataCoordinate(coordinates),
                timezoneName: timezoneName,
                comments: comments || null
            }
        });

    return {
        zones: zones,
        numberOfZones: zones.length
    }
}

function isValidZoneTabRow(row: string[]) {
    // A valid row looks like:
    // [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ],

    const countryCodeValid = /^[A-Z]{2}$/.test(row[0]);
    return countryCodeValid
}
