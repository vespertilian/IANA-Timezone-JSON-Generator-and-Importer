"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractGeographicAreaAndLocation = void 0;
function extractGeographicAreaAndLocation(input) {
    const firstSlash = input.indexOf('/');
    const geographicArea = input.slice(0, firstSlash);
    // + 1 (don't actually copy the first slash)
    const location = input.slice(firstSlash + 1, input.length);
    return { geographicArea, location };
}
exports.extractGeographicAreaAndLocation = extractGeographicAreaAndLocation;
//# sourceMappingURL=extract-geographic-area-and-location.js.map