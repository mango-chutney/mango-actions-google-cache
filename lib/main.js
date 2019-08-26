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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const parseKey_1 = __importDefault(require("./parseKey"));
const save_cache_1 = __importDefault(require("./save_cache"));
const restore_cache_1 = __importDefault(require("./restore_cache"));
// Todo: Test for gsutil installed
// Todo: Work for multiple OS
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get inputs
            const type = core.getInput('type', { required: true });
            // Bail out if type is not defined
            if (!type || type === '') {
                throw new Error('Cache Types must be: save or restore');
            }
            const bucket = core.getInput('bucket', { required: true });
            const key = yield parseKey_1.default(core.getInput('key'));
            const directory = core.getInput('directory');
            // Depending on type depends on if input is required
            if (type === 'save') {
                const paths = core.getInput('paths', { required: true });
                const overwrite = core.getInput('overwrite');
                const threshold = core.getInput('threshold');
                yield save_cache_1.default({ bucket, directory, key, overwrite, paths, threshold });
            }
            else if (type === 'restore') {
                yield restore_cache_1.default({ bucket, key, directory });
            }
            else {
                throw new Error('Cache Types must be: save or restore');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
