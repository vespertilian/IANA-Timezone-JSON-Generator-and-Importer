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
const get_iana_tz_data_1 = require("../get-iana-tz-data/get-iana-tz-data");
const extract_tz_data_1 = require("../extract-tz-data/extract-tz-data");
const path = require("path");
const Handlebars = require("handlebars");
const util_1 = require("../util/util");
const defaultSettings = {
    templatesPath: path.join(__dirname, '..', '..', 'templates'),
    saveDirectory: path.join(__dirname, '..', '..', 'timezones'),
    zoneFileNames: ['zone1970.tab', 'zone.tab']
};
function createJSONFromHandlebarsTemplatesAndZoneData(_settings = {}, _getIANATzData = get_iana_tz_data_1.getIANATzData, _createJSONFromHandlebarsTemplates = createJSONFromHandlebarsTemplates, _readdirAsync = util_1.readdirAsync) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = Object.assign({}, defaultSettings, _settings);
        const zoneData = yield _getIANATzData();
        const files = yield _readdirAsync(settings.templatesPath);
        settings.zoneFileNames.forEach((name) => __awaiter(this, void 0, void 0, function* () {
            const extractedZoneData = extract_tz_data_1.extractTzData(zoneData, name);
            yield _createJSONFromHandlebarsTemplates(files, extractedZoneData, settings.templatesPath, name, settings.saveDirectory);
        }));
    });
}
exports.createJSONFromHandlebarsTemplatesAndZoneData = createJSONFromHandlebarsTemplatesAndZoneData;
function createJSONFromHandlebarsTemplates(files, extractedZoneData, templatesPath, zoneFileName, saveDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        files
            .filter(isHandleBarsFile)
            .forEach((filename) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Creating JSON for: ${filename} with ${zoneFileName}`);
            const filePath = `${templatesPath}/${filename}`;
            const hbsFile = yield util_1.readFileAsync(filePath, 'utf-8');
            const hbsTemplate = Handlebars.compile(hbsFile);
            const output = hbsTemplate(extractedZoneData);
            try {
                // parseJSON to make sure it is valid!
                const parsedJSON = JSON.parse(output);
                // create filename and path
                const filenameSansTab = zoneFileName.replace('.tab', '');
                const writeFileName = `${extractedZoneData.version}-${filenameSansTab}-${filename.replace('.hbs', '.json')}`;
                const writePath = path.join(saveDirectory, writeFileName);
                // turn json into pretty string and write file,
                // this formats it slightly better than handlebars
                const jsonString = JSON.stringify(parsedJSON, null, 4);
                yield util_1.writeFileAsync(writePath, jsonString);
            }
            catch (e) {
                const errorPath = path.join(saveDirectory, 'error.txt');
                try {
                    yield util_1.writeFileAsync(errorPath, output);
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
exports.createJSONFromHandlebarsTemplates = createJSONFromHandlebarsTemplates;
function isHandleBarsFile(filename) {
    return filename.includes('.hbs');
}
//# sourceMappingURL=create-json-from-handlebars-templates.js.map