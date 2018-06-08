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
const walk_1 = require("../util/walk");
const extract_tz_data_1 = require("../extract-tz-data/extract-tz-data");
const get_iana_tz_data_1 = require("../get-iana-tz-data/get-iana-tz-data");
const create_json_from_handlebars_templates_1 = require("../create-json-from-handlebars-templates/create-json-from-handlebars-templates");
const path = require("path");
const create_json_from_ts_functions_1 = require("../create-json-from-ts-function/create-json-from-ts-functions");
const defaultSettings = {
    templatesPath: path.join(__dirname, '..', '..', 'templates'),
    saveDirectory: path.join(__dirname, '..', '..', 'timezones'),
    zoneFileNames: ['zone1970.tab']
};
function createJSONFromTemplatesAndZoneData(_settings = {}, _getIANATzData = get_iana_tz_data_1.getIANATzData, _createJSONFromHandlebarsTemplates = create_json_from_handlebars_templates_1.createJSONFromHandlebarsTemplates, _createJSONFromTsFunctions = create_json_from_ts_functions_1.createJsonFromTsFunctions, _extractTzData = extract_tz_data_1.extractTzData, _walk = walk_1.walk) {
    return __awaiter(this, void 0, void 0, function* () {
        const { zoneFileNames, saveDirectory, templatesPath } = Object.assign({}, defaultSettings, _settings);
        const zoneData = yield _getIANATzData({ filesToExtract: zoneFileNames });
        const allFiles = yield _walk(templatesPath);
        const handlebarsTemplateFileNames = allFiles.filter(isHandleBarsFile);
        const typescriptFiles = allFiles.filter(isTypescriptFile);
        zoneFileNames.forEach((zoneFileName) => __awaiter(this, void 0, void 0, function* () {
            const extractedZoneData = yield _extractTzData(zoneData, zoneFileName);
            yield _createJSONFromHandlebarsTemplates({
                templateFileNames: handlebarsTemplateFileNames,
                extractedZoneData,
                templatesPath,
                zoneFileName,
                saveDirectory
            });
            yield _createJSONFromTsFunctions({
                templateFileNames: typescriptFiles,
                extractedZoneData,
                templatesPath,
                zoneFileName,
                saveDirectory
            });
        }));
    });
}
exports.createJSONFromTemplatesAndZoneData = createJSONFromTemplatesAndZoneData;
function isHandleBarsFile(filename) {
    return filename.includes('.hbs');
}
function isTypescriptFile(filename) {
    // do not include type files
    return filename.includes('.ts') && !filename.includes('.type');
}
//# sourceMappingURL=create-json-from-templates-and-zone-data.js.map