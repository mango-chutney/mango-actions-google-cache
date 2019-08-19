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
const save_cache = (bucket, key, files, overwrite) => __awaiter(this, void 0, void 0, function* () {
    try {
        const cache_file = `./${key}.tgz`;
        if (!overwrite) {
            try {
                const bucket_file = `${bucket}/${key}.tgz`;
                yield exec.exec(`gsutil ls gs://${bucket_file}`);
                console.log('Cache file exists, exiting save_cache without over-writing cache file.');
            }
            catch (_a) {
                console.log(`Compressing cache to ${cache_file}`);
                yield exec.exec('tar', ['cpzf', cache_file, ...files, '-P']);
                console.log('Uploading cache to Google Cloud Storage...');
                yield exec.exec(`gsutil -o cp -R ${cache_file} ${bucket}`);
            }
        }
        else {
            console.log(`Compressing cache to ${cache_file}`);
            yield exec.exec('tar', ['cpzf', cache_file, ...files, '-P']);
            console.log('Uploading cache to Google Cloud Storage...');
            yield exec.exec(`gsutil -o cp -R ${cache_file} ${bucket}`);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = save_cache;
