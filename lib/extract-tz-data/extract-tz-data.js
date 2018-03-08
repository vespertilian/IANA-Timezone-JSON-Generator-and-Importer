"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const CSV = require("csv-string");
//@ts-ignore
const parseTzdataCoordinate = require("parse-tzdata-coordinate");
const util_1 = require("../util/util");
const math = require("mathjs");
function extractTzData(zoneData, zoneFileName) {
    const separator = '\t';
    const parsedCSV = CSV.parse(zoneData[zoneFileName], separator);
    const filteredZoneData = parsedCSV.filter(isValidZoneTabRow);
    const zones = filteredZoneData
        .map(zoneData => {
        const [countryCode, coordinates, timezoneName, comments] = zoneData;
        return {
            countryCode: util_1.removeLineBreaks(countryCode),
            coordinates: parseCoordinates(coordinates),
            timezoneName: util_1.removeLineBreaks(timezoneName),
            comments: comments || null
        };
    });
    return {
        zones: zones,
        numberOfZones: zones.length,
        version: zoneData.version,
        originalFileName: zoneFileName
    };
}
exports.extractTzData = extractTzData;
function parseCoordinates(coordinates) {
    const _coordinates = parseTzdataCoordinate(coordinates);
    ['longitude', 'latitude'].forEach((latlong) => {
        // add a negative variable for use with the handlebars templates
        const coordinate = _coordinates[latlong];
        coordinate.negative = Boolean(coordinate.sign === '-');
        // always return seconds .. just return null when they are not present
        if (!coordinate.second) {
            coordinate.second = null;
        }
        // return the decimal representation of
        coordinate.decimal = convertToDecimal(coordinate);
    });
    return _coordinates;
}
function isValidZoneTabRow(row) {
    // A valid row looks like:
    // [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ],
    const countryCodeValid = /^[A-Z]{2}$/.test(row[0]);
    return countryCodeValid;
}
function convertToDecimal(coordinate) {
    // use the math library for more accurate calculations with floating point numbers
    const decimalDegrees = math.bignumber(coordinate.degree);
    const decimalMinutes = math.divide(math.bignumber(coordinate.minute), math.bignumber(60));
    const decimalSeconds = coordinate.second ?
        math.divide(math.bignumber(coordinate.second), math.bignumber(3600))
        : math.bignumber(0);
    const result = math.round(math.sum(decimalDegrees, decimalMinutes, decimalSeconds), 6);
    if (coordinate.sign === '+') {
        return result.toNumber();
    }
    else {
        return -result.toNumber();
    }
}
//# sourceMappingURL=extract-tz-data.js.map