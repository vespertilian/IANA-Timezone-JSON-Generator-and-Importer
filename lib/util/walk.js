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
const util_1 = require("./util");
const path = require("path");
function walk(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = [];
        const values = yield util_1.readdirAsync(dir);
        for (let value of values) {
            const fileOrDir = path.resolve(dir, value);
            const stat = yield util_1.statAsync(fileOrDir);
            if (stat.isDirectory()) {
                const newDir = fileOrDir;
                const subdirectoryFiles = yield walk(newDir);
                const filesWithDirectory = subdirectoryFiles.map(fileName => `${value}/${fileName}`);
                files = files.concat(filesWithDirectory);
            }
            else {
                files.push(value);
            }
        }
        return files;
    });
}
exports.walk = walk;
//# sourceMappingURL=walk.js.map