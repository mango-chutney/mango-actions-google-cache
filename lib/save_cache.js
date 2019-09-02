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
const compressAndUpload = (bucket, cache_file, directory, paths, threshold) => __awaiter(this, void 0, void 0, function* () {
    console.log(`Compressing cache to ${cache_file}`);
    yield exec.exec(`tar cpzf ${cache_file} -C ${directory} ${paths} -P`);
    console.log('Uploading cache to Google Cloud Storage...');
    yield exec.exec(`gsutil -o GSUtil:parallel_composite_upload_threshold=${threshold}M cp -r ${cache_file} gs://${bucket}`);
});
const save_cache = ({ bucket, directory, key, overwrite, paths, threshold, }) => __awaiter(this, void 0, void 0, function* () {
    try {
        const cache_file = `${directory}/${key}.tgz`;
        if (overwrite === 'no') {
            const bucket_file = `gs://${bucket}/${key}.tgz`;
            let out = '';
            let err = '';
            const options = {
                listeners: {
                    stdout: (data) => {
                        out += data.toString();
                    },
                    stderr: (data) => {
                        err += data.toString();
                    },
                },
                ignoreReturnCode: true,
            };
            yield exec.exec(`gsutil ls ${bucket_file}`, undefined, options);
            console.log(out.trim());
            console.log(err.trim());
            if (out.trim() === bucket_file) {
                throw new Error('Cache file exists, exiting save_cache without over-writing cache file.');
            }
            if (err.trim() === 'CommandException: One or more URLs matched no objects.') {
                console.log('Object does not exist, uploading new file');
                compressAndUpload(bucket, cache_file, directory, paths, threshold);
            }
        }
        else {
            compressAndUpload(bucket, cache_file, directory, paths, threshold);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = save_cache;
