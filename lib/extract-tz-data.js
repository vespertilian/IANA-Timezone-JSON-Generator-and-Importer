"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const CSV = require("csv-string");
//@ts-ignore
const parseTzdataCoordinate = require("parse-tzdata-coordinate");
function extractTzData(zoneData, zoneFileName) {
    const separator = '\t';
    const parsedCSV = CSV.parse(zoneData[zoneFileName], separator);
    const filteredZoneData = parsedCSV.filter(isValidZoneTabRow);
    const zones = filteredZoneData
        .map(zoneData => {
        const [countryCode, coordinates, timezoneName, comments] = zoneData;
        return {
            countryCode: countryCode,
            coordinates: parseTzdataCoordinate(coordinates),
            timezoneName: timezoneName,
            comments: comments || null
        };
    });
    return {
        zones: zones,
        numberOfZones: zones.length
    };
}
exports.extractTzData = extractTzData;
function isValidZoneTabRow(row) {
    // A valid row looks like:
    // [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ],
    const countryCodeValid = /^[A-Z]{2}$/.test(row[0]);
    return countryCodeValid;
}
//# sourceMappingURL=extract-tz-data.js.map