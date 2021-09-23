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
exports.loadIANATzJsonFile = void 0;
const util_1 = require("../util/util");
const path = require("path");
const walk_1 = require("../util/walk");
function loadIANATzJsonFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const timezonesPath = path.join(__dirname, '../..', 'timezones');
        const files = yield walk_1.walk(timezonesPath);
        if (!files.includes(filename)) {
            throw new Error(`
            File does not exist
            Options: ${files}
        `);
        }
        const filePath = path.join(timezonesPath, filename);
        const file = yield util_1.readFileAsync(filePath);
        return file.toString();
    });
}
exports.loadIANATzJsonFile = loadIANATzJsonFile;
//# sourceMappingURL=load-iana-tz-json-file.js.map