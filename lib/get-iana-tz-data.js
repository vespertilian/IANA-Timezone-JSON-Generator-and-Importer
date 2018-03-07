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
//@ts-ignore
const decompressTargz = require("decompress-targz");
const node_fetch_1 = require("node-fetch");
function getIANATzData(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const defults = {
            url: 'https://www.iana.org/time-zones/repository/tzdata-latest.tar.gz',
            filesToExtract: ['zone.tab', 'zone1970.tab'],
            fileEncoding: 'utf8'
        };
        const { url, filesToExtract, fileEncoding } = Object.assign(defults, params);
        const result = yield node_fetch_1.default(url);
        if (!result.ok) {
            throw new Error(`Fetch failed: ${result.status}`);
        }
        const buffer = yield result.buffer();
        const decompressed = yield decompressTargz()(buffer);
        const IANATzDataFiles = decompressed.reduce((acc, file) => {
            const fileName = file.path;
            if (filesToExtract.includes(fileName) || fileName === 'version') {
                const document = file.data.toString(fileEncoding);
                acc[fileName] = document;
            }
            return acc;
        }, { version: 'no version file found' });
        IANATzDataFiles.version = replaceLineBreaks(IANATzDataFiles.version);
        return IANATzDataFiles;
    });
}
exports.getIANATzData = getIANATzData;
function replaceLineBreaks(value) {
    return value.replace(/\n/g, '');
}
//# sourceMappingURL=get-iana-tz-data.js.map