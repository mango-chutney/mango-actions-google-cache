import * as exec from '@actions/exec';

interface SaveCacheOptions {
  bucket: string;
  directory: string;
  key: string;
  overwrite: string;
  paths: string;
  threshold: string;
}

const compressAndUpload = async (
  bucket: string,
  cache_file: string,
  directory: string,
  paths: string,
  threshold: string,
) => {
  console.log(`Compressing cache to ${cache_file}`);

  await exec.exec(`tar cpzf ${cache_file} -C ${directory} ${paths} -P`);

  console.log('Uploading cache to Google Cloud Storage...');

  await exec.exec(
    `gsutil -o GSUtil:parallel_composite_upload_threshold=${threshold}M cp -r ${cache_file} gs://${bucket}`,
  );
};

const save_cache = async ({
  bucket,
  directory,
  key,
  overwrite,
  paths,
  threshold,
}: SaveCacheOptions) => {
  try {
    const cache_file = `${directory}/${key}.tgz`;
    if (overwrite === 'no') {
      const bucket_file = `gs://${bucket}/${key}.tgz`;

      let out = '';
      let err = '';

      const options = {
        listeners: {
          stdout: (data: Buffer) => {
            out += data.toString();
          },
          stderr: (data: Buffer) => {
            err += data.toString();
          },
        },
        ignoreReturnCode: true,
      };

      await exec.exec(`gsutil ls ${bucket_file}`, undefined, options);

      console.log(out.trim());
      console.log(err.trim());

      if (out.trim() === bucket_file) {
        throw new Error(
          'Cache file exists, exiting save_cache without over-writing cache file.',
        );
      }

      if (
        err.trim() === 'CommandException: One or more URLs matched no objects.'
      ) {
        console.log('Object does not exist, uploading new file');
        compressAndUpload(bucket, cache_file, directory, paths, threshold);
      }
    } else {
      compressAndUpload(bucket, cache_file, directory, paths, threshold);
    }
  } catch (err) {
    console.log(err);
  }
};

export default save_cache;
