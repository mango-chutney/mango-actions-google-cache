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
const save_cache = (bucket, key, directory) => __awaiter(this, void 0, void 0, function* () {
    try {
        const remote_cache_file = `${bucket}/${key}.tgz`;
        const dir = directory || '.';
        console.log(`Downloading Cache file: ${remote_cache_file}`);
        yield exec.exec(`gsutil -q cp gs://${remote_cache_file} ${dir}`);
        const src_dir = `${dir}/${key}.tgz`;
        console.log(`Restoring Cache file: ${src_dir}`);
        yield exec.exec(`tar xpzf "${src_dir}" -P`);
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = save_cache;
