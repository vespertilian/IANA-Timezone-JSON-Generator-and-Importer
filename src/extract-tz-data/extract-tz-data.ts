//@ts-ignore
import * as CSV from 'csv-string';
//@ts-ignore
import * as parseTzdataCoordinate from 'parse-tzdata-coordinate';
import {removeLineBreaks} from '../util/util';
import * as math from 'mathjs'
import {isValidZoneTabRow} from './is-valid-zone-tab-row';
import {extractGeographicAreaAndLocation} from './extract-geographic-area-and-location';
import {ICoordinates, IExtractedTimezone, IExtractedTimezoneData} from '../types-for-ts-templates';
import {formatLocation} from './format-location';
import { BigNumber, Fraction } from 'mathjs';

export function extractTzData(zoneData: any, zoneFileName: string): IExtractedTimezoneData {
    const separator = '\t';
    const parsedCSV: string[][] = CSV.parse(zoneData[zoneFileName], separator) as any;

    const filteredZoneData = parsedCSV.filter(isValidZoneTabRow);

    const zones: IExtractedTimezone[] = filteredZoneData
        .map(zoneData => {
            const [countryCodes , coordinates, timezoneName, comments] = zoneData;
            const allCodes = countryCodes.split(',');
            const {geographicArea, location} = extractGeographicAreaAndLocation(timezoneName);

            const extractedTimezone: IExtractedTimezone = {
                countryCodes: allCodes,
                coordinates: parseCoordinates(coordinates),
                timezoneName: removeLineBreaks(timezoneName),
                geographicArea: geographicArea,
                geographicAreaDisplayName: geographicAreaDisplayName(geographicArea),
                location,
                locationDisplayName: formatLocation(location),
                comments: comments || null
            };
            return extractedTimezone
        });

    return {
        zones: zones,
        numberOfZones: zones.length,
        version: zoneData.version,
        originalFileName: zoneFileName
    }
}

function parseCoordinates(coordinates: string): ICoordinates {
    const _coordinates = parseTzdataCoordinate(coordinates);
    ['longitude', 'latitude'].forEach((latlong) => {
        // add a negative variable for use with the handlebars templates
        const coordinate = _coordinates[latlong];
        coordinate.negative = Boolean(coordinate.sign === '-');

        // always return seconds .. just return null when they are not present
        if(!coordinate.second) {
            coordinate.second = null;
        }

        // return the decimal representation of
        coordinate.decimal = convertToDecimal(coordinate)
    });
    return _coordinates
}

function convertToDecimal(coordinate: {sign: string, degree: string, minute: string, second: string | null}) {
    // use the math library for more accurate calculations with floating point numbers
    const decimalDegrees = math.bignumber(coordinate.degree);
    const decimalMinutes =  math.divide(math.bignumber(coordinate.minute), math.bignumber(60)) as Fraction;
    const decimalSeconds: Fraction | BigNumber = coordinate.second
        ? math.divide(math.bignumber(coordinate.second), math.bignumber(3600)) as Fraction
        : math.bignumber(0);
    const result: any = math.round(math.sum(decimalDegrees, decimalMinutes, decimalSeconds), 6)
    if(coordinate.sign === '+') {
        return result.toNumber()
    } else {
        return -result.toNumber()
    }
}

// add Ocean to the geographicArea for extra context
function geographicAreaDisplayName(area: string) {
    switch(area) {
        case 'Indian':
            return 'Indian Ocean';
        case 'Atlantic':
            return 'Atlantic Ocean';
        case 'Pacific':
            return 'Pacific Ocean';
        default:
            return area;
    }
}
