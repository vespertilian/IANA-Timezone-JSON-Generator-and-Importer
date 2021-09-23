"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLocation = void 0;
function formatLocation(location) {
    const displayName = location
        .replace('/', ' - ')
        .replace('_', ' ');
    return displayName;
}
exports.formatLocation = formatLocation;
//# sourceMappingURL=format-location.js.map