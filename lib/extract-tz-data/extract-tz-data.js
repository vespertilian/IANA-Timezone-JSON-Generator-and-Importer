"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTzData = void 0;
//@ts-ignore
const CSV = require("csv-string");
//@ts-ignore
const parseTzdataCoordinate = require("parse-tzdata-coordinate");
const util_1 = require("../util/util");
const math = require("mathjs");
const is_valid_zone_tab_row_1 = require("./is-valid-zone-tab-row");
const extract_geographic_area_and_location_1 = require("./extract-geographic-area-and-location");
const format_location_1 = require("./format-location");
function extractTzData(zoneData, zoneFileName) {
    const separator = '\t';
    const parsedCSV = CSV.parse(zoneData[zoneFileName], separator);
    const filteredZoneData = parsedCSV.filter(is_valid_zone_tab_row_1.isValidZoneTabRow);
    const zones = filteredZoneData
        .map(zoneData => {
        const [countryCodes, coordinates, timezoneName, comments] = zoneData;
        const allCodes = countryCodes.split(',');
        const { geographicArea, location } = extract_geographic_area_and_location_1.extractGeographicAreaAndLocation(timezoneName);
        const extractedTimezone = {
            countryCodes: allCodes,
            coordinates: parseCoordinates(coordinates),
            timezoneName: util_1.removeLineBreaks(timezoneName),
            geographicArea: geographicArea,
            geographicAreaDisplayName: geographicAreaDisplayName(geographicArea),
            location,
            locationDisplayName: format_location_1.formatLocation(location),
            comments: comments || null
        };
        return extractedTimezone;
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
function convertToDecimal(coordinate) {
    // use the math library for more accurate calculations with floating point numbers
    const decimalDegrees = math.bignumber(coordinate.degree);
    const decimalMinutes = math.divide(math.bignumber(coordinate.minute), math.bignumber(60));
    const decimalSeconds = coordinate.second
        ? math.divide(math.bignumber(coordinate.second), math.bignumber(3600))
        : math.bignumber(0);
    const result = math.round(math.sum(decimalDegrees, decimalMinutes, decimalSeconds), 6);
    if (coordinate.sign === '+') {
        return result.toNumber();
    }
    else {
        return -result.toNumber();
    }
}
// add Ocean to the geographicArea for extra context
function geographicAreaDisplayName(area) {
    switch (area) {
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
//# sourceMappingURL=extract-tz-data.js.map