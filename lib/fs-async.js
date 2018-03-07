"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = require("fs");
exports.readdirAsync = util_1.promisify(fs.readdir);
exports.readFileAsync = util_1.promisify(fs.readFile);
exports.writeFileAsync = util_1.promisify(fs.writeFile);
//# sourceMappingURL=fs-async.js.map