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
exports.createJsonFromTsFunctions = void 0;
const util_1 = require("../util/util");
const path = require("path");
function createJsonFromTsFunctions(params, _writeFileAsync = util_1.writeFileAsync, _ensureExistsAsync = util_1.ensureExistsAsync, _log = console.log) {
    return __awaiter(this, void 0, void 0, function* () {
        const { templateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory } = params;
        for (const filenamePath of params.templateFileNames) {
            _log(`Creating JSON for: ${filenamePath} with ${zoneFileName}`);
            const fullFilePath = `${params.templatesPath}/${filenamePath}`;
            const fullFilePathWithoutExtension = fullFilePath.slice(0, fullFilePath.lastIndexOf('.'));
            const creationFile = yield Promise.resolve().then(() => require(fullFilePathWithoutExtension));
            const filesToBeCreated = creationFile.createFiles(params.extractedZoneData);
            const endFilePosition = filenamePath.lastIndexOf('/');
            // i.e saveDirFoo/test-dir
            const savePath = (endFilePosition > 0) ? // maybe there is no sub-directory
                `${saveDirectory}/${filenamePath.slice(0, endFilePosition)}` :
                saveDirectory;
            const zoneFilenameSansTab = zoneFileName.replace('.tab', '');
            for (const file of filesToBeCreated) {
                const writeFileName = `${extractedZoneData.version}-${zoneFilenameSansTab}-${file.fileName}.json`;
                const writePath = path.join(savePath, writeFileName);
                yield _ensureExistsAsync(savePath);
                yield _writeFileAsync(writePath, file.json);
            }
        }
    });
}
exports.createJsonFromTsFunctions = createJsonFromTsFunctions;
//# sourceMappingURL=create-json-from-ts-functions.js.map