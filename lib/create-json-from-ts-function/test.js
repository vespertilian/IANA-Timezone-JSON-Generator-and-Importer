"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiles = void 0;
function createFiles(extractedTimezoneData) {
    const fileA = { fileName: 'file-a', json: JSON.stringify({ a: extractedTimezoneData.numberOfZones }) };
    const fileB = { fileName: 'file-b', json: JSON.stringify({ b: extractedTimezoneData.version }) };
    return [fileA, fileB];
}
exports.createFiles = createFiles;
//# sourceMappingURL=test.js.map