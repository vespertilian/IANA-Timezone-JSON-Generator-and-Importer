"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJSONFromHandlebarsTemplates = void 0;
const path = require("path");
const Handlebars = require("handlebars");
const util_1 = require("../util/util");
function createJSONFromHandlebarsTemplates(params, _writeFileAsync = util_1.writeFileAsync, _readFileAsync = util_1.readFileAsync, _ensureExistsAsync = util_1.ensureExistsAsync, _log = console.log) {
    return __awaiter(this, void 0, void 0, function* () {
        const { templateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory } = params;
        for (let filenamePath of templateFileNames) {
            // includes the file sub-directories and filename
            // i.e test-dir/aaa.hbs
            yield createJSONFile(filenamePath);
        }
        function createJSONFile(filenamePath) {
            return __awaiter(this, void 0, void 0, function* () {
                _log(`Creating JSON for: ${filenamePath} with ${zoneFileName}`);
                const filePath = `${templatesPath}/${filenamePath}`;
                const hbsFile = yield _readFileAsync(filePath, 'utf-8');
                const hbsTemplate = Handlebars.compile(hbsFile);
                const output = hbsTemplate(extractedZoneData);
                const endFilePosition = filenamePath.lastIndexOf('/');
                // i.e aaa.hbs
                const endFileName = (endFilePosition > 0) ?
                    filenamePath.slice(endFilePosition + 1, filenamePath.length) :
                    filenamePath;
                // i.e saveDirFoo/test-dir
                const savePath = (endFilePosition > 0) ?
                    `${saveDirectory}/${filenamePath.slice(0, endFilePosition)}` :
                    saveDirectory;
                try {
                    // parseJSON to make sure it is valid!
                    const parsedJSON = JSON.parse(output);
                    // create filename and path
                    const zoneFilenameSansTab = zoneFileName.replace('.tab', '');
                    const writeFileName = `${extractedZoneData.version}-${zoneFilenameSansTab}-${endFileName.replace('.hbs', '.json')}`;
                    const writePath = path.join(savePath, writeFileName);
                    // turn json into pretty string and write file,
                    // this conversion formats it slightly better than handlebars
                    const jsonString = JSON.stringify(parsedJSON, null, 4);
                    yield _ensureExistsAsync(savePath);
                    yield _writeFileAsync(writePath, jsonString);
                }
                catch (e) {
                    const errorPath = path.join(saveDirectory, 'error.txt');
                    try {
                        yield _writeFileAsync(errorPath, output);
                    }
                    catch (e) {
                        throw new Error(`
                Could not write error file: ${e}
                Trying to write to path: ${errorPath}
               `);
                    }
                    throw new Error(`
                Could not parse JSON please check your templates.
                See timezones/error.txt 
                Error: ${e}
            `);
                }
            });
        }
    });
}
exports.createJSONFromHandlebarsTemplates = createJSONFromHandlebarsTemplates;
//# sourceMappingURL=create-json-from-handlebars-templates.js.map