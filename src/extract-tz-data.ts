//@ts-ignore
import * as CSV from 'csv-string';
//@ts-ignore
import * as parseTzdataCoordinate from 'parse-tzdata-coordinate';
import {replaceLineBreaks} from './util/util';

export interface ICoordinates {
    latitude: {
        negativeSign: boolean,
        sign: string
        degree: number,
        minute: number,
        second: number | undefined
    },
    longitude: {
        negativeSign: boolean,
        sign: string
        degree: number,
        minute: number,
        second: number | undefined
    }
}

export interface IExtractedTimezone {
    countryCode: string,
    coordinates: ICoordinates
    timezoneName: string
    comments: string | null
}

export interface IExtractedTimezoneData {
    zones: IExtractedTimezone[]
    numberOfZones: number
    version: string
}

export function extractTzData(zoneData: any, zoneFileName: string): IExtractedTimezoneData {
    const separator = '\t';
    const parsedCSV: string[][] = CSV.parse(zoneData[zoneFileName], separator);

    const filteredZoneData = parsedCSV.filter(isValidZoneTabRow);

    const zones = filteredZoneData
        .map(zoneData => {
            const [countryCode , coordinates, timezoneName, comments] = zoneData;
            return {
                countryCode: replaceLineBreaks(countryCode),
                coordinates: parseTzdataCoordinate(coordinates),
                timezoneName: replaceLineBreaks(timezoneName),
                comments: comments || null
            }
        });

    return {
        zones: zones,
        numberOfZones: zones.length,
        version: zoneData.version
    }
}

function parseTzdataCoordinates(coordinates: string) {
    const coordinate = parseTzdataCoordinate(coordinates);
    coordinate.negativeSign = Boolean(coordinate.sign === '-')
}

function isValidZoneTabRow(row: string[]) {
    // A valid row looks like:
    // [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ],

    const countryCodeValid = /^[A-Z]{2}$/.test(row[0]);
    return countryCodeValid
}
