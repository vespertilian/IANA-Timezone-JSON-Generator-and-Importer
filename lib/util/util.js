"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = require("fs");
exports.readdirAsync = util_1.promisify(fs.readdir);
exports.readFileAsync = util_1.promisify(fs.readFile);
exports.writeFileAsync = util_1.promisify(fs.writeFile);
exports.unlinkAsync = util_1.promisify(fs.unlink);
exports.statAsync = util_1.promisify(fs.stat);
function removeLineBreaks(value) {
    return value.replace(/\n/g, '');
}
exports.removeLineBreaks = removeLineBreaks;
function ensureExistsFactory(mkdir = fs.mkdir) {
    return function ensureExists(path, cb) {
        const mask = '0777';
        mkdir(path, mask, function (err) {
            if (err) {
                if (err.code == 'EEXIST')
                    cb(null); // ignore the error if the folder already exists
                else
                    cb(err); // something else went wrong
            }
            else
                cb(null); // successfully created folder
        });
    };
}
exports.ensureExistsFactory = ensureExistsFactory;
exports.ensureExistsAsync = util_1.promisify(ensureExistsFactory());
//# sourceMappingURL=util.js.map