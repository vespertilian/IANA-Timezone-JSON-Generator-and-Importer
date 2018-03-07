"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_iana_tz_data_1 = require("./get-iana-tz-data");
const extract_tz_data_1 = require("./extract-tz-data");
const path = require("path");
const Handlebars = require("handlebars");
const fs_async_1 = require("./fs-async");
function getAndExtractTzData() {
    return __awaiter(this, void 0, void 0, function* () {
        const zoneData = yield get_iana_tz_data_1.getIANATzData();
        const extractedZoneData = extract_tz_data_1.extractTzData(zoneData, 'zone.tab');
        const templatePath = path.join(__dirname, '..', 'templates');
        const files = yield fs_async_1.readdirAsync(templatePath);
        files
            .filter(isJSONFile)
            .forEach((filename) => __awaiter(this, void 0, void 0, function* () {
            const filePath = `${templatePath}/${filename}`;
            const hbsFile = yield fs_async_1.readFileAsync(filePath, 'utf-8');
            const hbsTemplate = Handlebars.compile(hbsFile);
            const output = hbsTemplate({
                zones: extractedZoneData.zones,
                numberOfZones: extractedZoneData.numberOfZones,
                ianaVersion: zoneData.version
            });
            try {
                // parseJSON to make sure it is valid!
                const parsedJSON = JSON.parse(output);
                // create filename and path
                const writeFileName = filename.replace('.hbs', '.json');
                const writePath = path.join(__dirname, '..', 'timezones', writeFileName);
                // turn json into pretty string and write file,
                // this formats it slightly better than handlebars
                const jsonString = JSON.stringify(parsedJSON, null, 4);
                yield fs_async_1.writeFileAsync(writePath, jsonString);
            }
            catch (e) {
                const errorPath = path.join(__dirname, '..', 'timezones', 'error.txt');
                try {
                    yield fs_async_1.writeFileAsync(errorPath, output);
                }
                catch (e) {
                    throw new Error(`
                Could not write error file: ${e}
               `);
                }
                throw new Error(`
                Could not parse JSON please check your templates.
                See timezones/error.txt 
                Error: ${e}
            `);
            }
        }));
    });
}
exports.getAndExtractTzData = getAndExtractTzData;
function isJSONFile(filename) {
    filename.includes('.json');
}
try {
    getAndExtractTzData();
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=create-tz-data-from-templates.js.map