import * as exec from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';

const parseKey = async (key: string) => {
  // Parse key for checksum
  const results = /\((.*?)\)/.exec(key);
  console.log(results);
  if (results) {
    const replaceKeys = results.filter((_, index) => index % 2 == 0);
    const checksumReplaceKeys = results.filter(
      (_, index) => Math.abs(index % 2) == 1,
    );
    // Run checksum on all checksum items
    const checksumReplaceValues = checksumReplaceKeys.map(
      async checksumItem => {
        let checksumOutput = '';
        let options: ExecOptions = {};
        options.listeners = {
          stdout: (data: Buffer) => {
            checksumOutput += data.toString();
          },
        };
        await exec.exec(`cksum ${checksumItem}`, undefined, options);
        console.log(checksumOutput);
        console.log(checksumItem);
        return await checksumOutput.split(' ')[0];
      },
    );

    // Finally replace checksums into old syntax
    let checksumedKey = key;
    replaceKeys.forEach(async (item, index) => {
      checksumedKey = checksumedKey.replace(
        item,
        await checksumReplaceValues[index],
      );
    });
    console.log(checksumedKey);
    return checksumedKey;
  }

  return null;
};

export default parseKey;
