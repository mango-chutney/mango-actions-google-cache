import * as crypto from 'crypto';
import * as fs from 'fs';

const checksum = (
  str: string,
  algorithm?: string,
  encoding?: crypto.HexBase64Latin1Encoding,
) =>
  crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');

const parseKey = async (key: string) =>
  key.replace(/\((.*?)\)/g, matched => {
    const stripBrackets = matched.replace('(', '').replace(')', '');

    const file = fs.readFileSync(stripBrackets, 'utf8');

    return checksum(file);
  });

export default parseKey;
