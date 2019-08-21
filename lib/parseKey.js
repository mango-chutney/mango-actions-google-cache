"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec = __importStar(require("@actions/exec"));
const parseKey = (key) => __awaiter(this, void 0, void 0, function* () {
    // Parse key for checksum
    const results = /\((.*?)\)/.exec(key);
    console.log(results);
    if (results) {
        const replaceKeys = results.filter((_, index) => index % 2 == 0);
        const checksumReplaceKeys = results.filter((_, index) => Math.abs(index % 2) == 1);
        // Run checksum on all checksum items
        const checksumReplaceValues = checksumReplaceKeys.map((checksumItem) => __awaiter(this, void 0, void 0, function* () {
            let checksumOutput = '';
            let options = {};
            options.listeners = {
                stdout: (data) => {
                    checksumOutput += data.toString();
                },
            };
            yield exec.exec(`cksum ${checksumItem}`, undefined, options);
            console.log(checksumOutput);
            console.log(checksumItem);
            return yield checksumOutput.split(' ')[0];
        }));
        // Finally replace checksums into old syntax
        let checksumedKey = key;
        replaceKeys.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
            checksumedKey = checksumedKey.replace(item, yield checksumReplaceValues[index]);
        }));
        console.log(checksumedKey);
        return checksumedKey;
    }
    return null;
});
exports.default = parseKey;
