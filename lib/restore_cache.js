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
const restore_cache = ({ bucket, key, directory }) => __awaiter(this, void 0, void 0, function* () {
    try {
        const remote_cache_file = `gs://${bucket}/${key}.tgz`;
        console.log(`Downloading Cache file: ${remote_cache_file}`);
        let err = '';
        yield exec.exec(`gsutil -q cp ${remote_cache_file} ${directory}`, undefined, {
            listeners: {
                stderr: (data) => {
                    err += data.toString();
                },
            },
            ignoreReturnCode: true,
        });
        if (err.includes('No URLs matched')) {
            throw new Error('No Cache file exists in cache bucket, skipping...');
        }
        const src_dir = `${directory}/${key}.tgz`;
        console.log(`Restoring Cache file: ${src_dir}`);
        yield exec.exec(`tar xpzf "${src_dir}" -P -C ${directory}`);
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = restore_cache;
